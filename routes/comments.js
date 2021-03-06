var express = require("express");
// make req.params.id available with mergeParams:
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// show new comment page:
// with logged in check middleware:
router.get("/new", middleware.isLoggedIn, function(req, res) {
  // find campground by ID:
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

// create comment:
// with logged in check middleware:
router.post("/", middleware.isLoggedIn, function(req, res) {
  // find campground by ID:
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // create comment:
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash("error", "Something went wrong!");
          console.log(err);
        } else {
          // add username and id to comment:
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment:
          comment.save();
          
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Successfully added the comment!");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// edit comment:
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
  // find comment by ID:
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});

// update comment:
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  // find comment by ID and update:
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// destroy comment:
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  // find comment by ID and remove:
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// module export:
module.exports = router;