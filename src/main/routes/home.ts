import * as config from "config";
import * as express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {

//  if (res.locals.isUserGroupA || res.locals.isUserGroupB) {
    res.redirect("/list");
//  } else if (res.locals.isUserGroupC) {
//    res.redirect('/search');
//  } else {
//    res.render("home", {
//      dmUploadUrl: config.get('services').dmUploadUrl,
//      dmFindDocumentsByCreator: config.get('services').dmFindDocumentsByCreator,
//      dmFindDocumentsByMetadata: config.get('services').dmFindDocumentsByMetadata,
//      jwt : req.cookies['__auth-token'] });
//  }

});

router.get("/logout", (req, res, next) => {
    res.clearCookie("__auth-token");
    res.redirect("/");
});

/* GET upload page. */
router.get("/upload", (req, res, next) => {
    res.render("upload-view", {
        dmFindDocumentsByCreator: config.get("services").dmFindDocumentsByCreator,
        dmFindDocumentsByMetadata: config.get("services").dmFindDocumentsByMetadata,
        dmUploadUrl: config.get("services").dmUploadUrl,
        dmViewerUrl: config.get("services").dmViewerUrl,
        jwt: req.cookies["__auth-token"],
    });
});

/* GET upload page. */
// router.get("/search", (req, res, next) => {
//  res.render("search-view", {
//    dmUploadUrl: config.get('services').dmUploadUrl,
//    dmFindDocumentsByCreator: config.get('services').dmFindDocumentsByCreator,
//    dmFindDocumentsByMetadata: config.get('services').dmFindDocumentsByMetadata,
//    jwt:req.cookies['__auth-token']
//    });
// });

/* GET upload page. */
router.get("/list/", (req, res, next) => {
    res.render("list-view", {
        dmFindDocumentsByCreator: config.get("services").dmFindDocumentsByCreator,
        dmFindDocumentsByMetadata: config.get("services").dmFindDocumentsByMetadata,
        dmUploadUrl: config.get("services").dmUploadUrl,
        dmViewerUrl: config.get("services").dmViewerUrl,
        jwt: req.cookies["__auth-token"],
        someref: req.params.someref,
    });
});

/* GET upload page. */
router.get("/list/:someref", (req, res, next) => {
    res.render("list-view", {
        dmFindDocumentsByCreator: config.get("services").dmFindDocumentsByCreator,
        dmFindDocumentsByMetadata: config.get("services").dmFindDocumentsByMetadata,
        dmUploadUrl: config.get("services").dmUploadUrl,
        dmViewerUrl: config.get("services").dmViewerUrl,
        jwt: req.cookies["__auth-token"],
        someref: req.params.someref,
    });
});

module.exports = router;
