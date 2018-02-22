import * as logging from "@hmcts/nodejs-logging";
import * as bodyParser from "body-parser";
import * as config from "config";
import * as cookieParser from "cookie-parser";
import * as csrf from "csurf";
import * as express from "express";
import * as expressNunjucks from "express-nunjucks";
// import { Helmet, IConfig as HelmetConfig } from "modules/helmet";
import * as path from "path";
import * as favicon from "serve-favicon";
import { RouterFinder } from "./router/routerFinder";
import * as idamExpressMiddleware from "./services/idam";
// import * as cors from "cors";

const env = process.env.NODE_ENV || "development";
export const app: express.Express = express();
app.locals.ENV = env;

// TODO: adjust these values to your application
logging.config(config.get("logging"));

// setup logging of HTTP requests
app.use(logging.express.accessLogger());

// let corsOptions = {
//   methods: ['GET', 'POST']
// };

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   res.header("Access-Control-Allow-Methods", "GET, POST");
//   next();
// });

const logger = logging.getLogger("app");

// secure the application by adding various HTTP headers to its responses
// disabled for now
// new Helmet(config.get<HelmetConfig>("security")).enableFor(app);

// view engine setup
app.set("views", [
    path.join(__dirname, "views"),
    path.join(__dirname, "..", "..", "node_modules", "govuk_template_jinja", "views", "layouts"),
    ]);
app.set("view engine", "html");

app.use("/", (req, res, next) => {
  res.locals.asset_path = "/public/";
  res.locals.homepage_url = "/";
  res.locals.logo_link_title = "Go to the homepage";
  res.locals.global_header_text = "HMCTS";
  res.locals.serviceName = "Document Management Node Demo App";
  next();
});

app.use(
    "/public",
    express.static(path.join(__dirname , "assets", "public"))); // Compiled code
app.use(
    "/public",
    express.static(path.join(__dirname , "public"))); // Local Code

app.use(
    "/public/javascripts", express.static(path.join(__dirname , "assets", "public", "js", "lib"))); // Compiled code
app.use(
    "/public/javascripts", express.static(path.join(__dirname , "assets", "public", "js"))); // Compiled code
app.use(
    "/javascripts", express.static(path.join(__dirname , "assets", "public", "js", "lib"))); // Compiled code
app.use(
    "/javascripts", express.static(path.join(__dirname , "assets", "public", "js"))); // Compiled code

app.use(
    "/public/images", express.static(path.join(__dirname , "assets", "public", "img", "lib"))); // Compiled code
app.use(
    "/public/images", express.static(path.join(__dirname , "assets", "public", "img"))); // Compiled code
app.use(
    "/images", express.static(path.join(__dirname , "assets", "public", "img", "lib"))); /// Compiled code
app.use(
    "/images", express.static(path.join(__dirname , "assets", "public", "img"))); // Compiled Code

app.use(
    "/public/stylesheets",
    express.static(path.join(__dirname , "assets", "public", "stylesheets", "lib"))); // Compiled Code
app.use(
    "/public/stylesheets", express.static(path.join(__dirname , "assets", "public", "stylesheets"))); // Compiled Code
app.use(
    "/stylesheets",
    express.static(path.join(__dirname , "assets", "public", "stylesheets", "lib"))); // Compiled Code
app.use(
    "/stylesheets",
    express.static(path.join(__dirname , "assets", "public", "stylesheets"))); // Compiled Code

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "assets")));
app.use(favicon(path.join(__dirname, "assets", "public", "img", "lib", "favicon.ico")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

expressNunjucks(app);

if (config.useCSRFProtection === true) {
  const csrfOptions = {
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    },
  };

  app.use(csrf(csrfOptions), (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  });
}

const idamExpressMiddlewareArgs = config.get("idamExpressMiddlewareArgs");

app.use(idamExpressMiddleware.landingPage(idamExpressMiddlewareArgs));
app.use(idamExpressMiddleware.authenticate(idamExpressMiddlewareArgs));
app.use(idamExpressMiddleware.protect(idamExpressMiddlewareArgs));

app.use("/", RouterFinder.findAll(path.join(__dirname, "routes")));

// returning "not found" page for requests with paths not resolved by the router
app.use((req, res, next) => {
  res.locals.message = "Not Found";
  res.locals.error = env === "development" ? new Error("Cannot Find " + req.url) : {};
  res.status(404);
  res.render("errors/404");
});

// error handler
app.use((err, req, res, next) => {
  logger.error(`${err.stack || err}`);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = env === "development" ? err : {};

  res.status(err.status || 500);
  res.render("errors/error");
});
