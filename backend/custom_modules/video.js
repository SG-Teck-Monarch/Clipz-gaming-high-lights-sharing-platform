const mongoose = require("mongoose");
const { UserModel } = require("./user");

class vidUtils {
  // Video Schema:
  videoSchema = new mongoose.Schema({
    title: { required: true, type: String },
    filePath: { required: true, type: String },
    owner: { required: true, type: String },
    ownerName: { required: true, type: String },
    uploadDate: { default: new Date(), required: true, type: Date },
  });

  VideoModel = mongoose.model("video", this.videoSchema, "videos");
  // to add a new video:
  async add(data) {
    try {
      const ownerUser = await UserModel.findOne({ _id: data.owner });

      data.ownerName = ownerUser.name;
      data.uploadDate = new Date();

      const newVideo = new this.VideoModel(data);

      const savedDoc = await newVideo.save();

      if (savedDoc) {
        return savedDoc._id;
      } else return false;
    } catch (error) {
      console.log(error);
    }
  }

  // to get a video by it's id:
  async get(id) {
    const video = await this.VideoModel.findOne({ _id: id });

    if (video) {
      return video;
    } else {
      return false;
    }
  }

  // to get all the videos uploaded by a particular user:
  async getManyByUserId(id, sortBy) {
    if (sortBy === undefined) sortBy = -1;

    // sortBy will have 1 if we want the oldest uploaded and we'll get the newest uploaded when it's value will be -1
    const videos = await this.VideoModel.find({ owner: id }).sort({
      _id: sortBy,
    });
    if (videos) {
      return videos;
    } else {
      return false;
    }
  }

  deleteVideo(vidId) {
    return new Promise((resolve, reject) => {
      this.VideoModel.deleteOne({ _id: vidId })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }
}

module.exports = new vidUtils();