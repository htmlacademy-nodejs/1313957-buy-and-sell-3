'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const offerExist = require(`../middlewares/offer-exists`);
const commentValidator = require(`../middlewares/comment-validator`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();

  app.use(`/offers`, route);

  route.get(`/:offerId/comments`, offerExist(offerService), async (req, res) => {
    const {offerId} = req.params;
    const comments = await commentService.findAll(offerId);

    res.status(HttpCode.OK)
      .json(comments);

  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), async (req, res) => {
    const {commentId, offerId} = req.params;
    const deletedComment = await commentService.drop(offerId, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], (req, res) => {
    const {offerId} = req.params;
    const comment = commentService.create(offerId, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
