import RedisClient from '../utils/redis';
import DBClient from '../utils/db';


class AppController {
  static async getStatus(req, res) {
    const redStatus = RedisClient.isAlive();
    const dbStatus = await DBClient.isAlive();

    res.status(200).json({"redis": redStatus, "db": dbStatus});
  }

  static async getStats(req, res) {
    const users = await DBClient.nbUsers();
    const files = await DBClient.nbFiles();

    res.status(200).json({"users": users, "files": files});
  }
}

export default AppController;
