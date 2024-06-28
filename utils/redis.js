// const { createClient } = require("redis");

import { createClient } from "redis";

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on("error", (err) => {
      // this.connected = false;
      console.log(err);
    });
    this.connected = () => {
      if (this.client) {
        return true;
      }
      return false;
    };
    // this.client.connect();
    //   this.connected = false;
    // this.client.on("connect", () => {
    //    this.connected = true;
    //   console.log("Redis connected");
    // });
  }

  isAlive() {
    // console.log(this.client.connected);
    return this.connected();
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
