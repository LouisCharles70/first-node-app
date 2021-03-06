const {Genre} = require("../../models/genre");
const request = require("supertest");
const {User} = require("../../models/user");
let server;

describe("/api/genres",() => {
   beforeEach(async() => {
      server = require("../../index");
   });

   afterEach(async() => {
      server.close();
      await Genre.remove({});
   });

   describe("GET /",() => {
      it("should return all genres",async () => {
         await Genre.collection.insertMany([
            {name: "genre1"},
            {name: "genre2"}
         ]);

         const res = await request(server).get("/api/genres");

         // Check status response
         expect(res.status).toBe(200);
         // Check we have the correct amount of genres
         expect(res.body.length).toBe(2);

         // Check we have genre1
         expect(res.body.some(g => g.name ==='genre1')).toBeTruthy();
         // Check we have genre2
         expect(res.body.some(g => g.name ==='genre2')).toBeTruthy();
      })
   })

   describe("GET /:id",() => {
      it("should return a 404 response when trying to fetch a non-existing genre",async() => {
         const res = await request(server).get("/api/genres/1");

         expect(res.status).toBe(404);
      })

      it("should return a genre if valid id is passed",async() => {
         const genre = new Genre({name: 'genre1'});
         await genre.save();

         const response = await request(server).get("/api/genres/"+genre._id);
         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty("name",genre.name);
      })
   })

   describe("POST /",() => {
      let token;
      let name;

      beforeEach(() => {
         token = new User().generateAuthToken();
         name = 'genre1';
      })

      const exec = async () => {
         return await request(server)
            .post("/api/genres")
            .set("x-auth-token",token)
            .send({ name });
      }

      it("should return 401 if client is not logged in",async() => {
         token = '';
         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 400 if genre is less than 5 characters",async() => {
         name = "1234";

         const res = await exec();
         expect(res.status).toBe(400);
      });

      it("should return 400 if genre is more than 50 characters",async() => {
         name = new Array(52).join("*");

         const res = await exec();
         expect(res.status).toBe(400);
      });

      it("should save the genre if it is valid",async() => {
         await exec();

         const genre = await Genre.find({name: "genre1"});
         expect(genre).not.toBeNull();
      });

      it("should return the genre if it is valid",async() => {
         const res = await exec();
         expect(res.status).toBe(200);

         expect(res.body).toHaveProperty("_id");
         expect(res.body).toHaveProperty("name","genre1");
      });
   })
})
