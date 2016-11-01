var express = require('express');
var path=require('path')
var mongoose = require('mongoose')
var _=require('underscore')
var Movie=require('./models/movie')
var port = process.env.PORT || 3000
var app = express();
var dbUrl = 'mongodb://localhost/movie'
mongoose.connect(dbUrl)
app.set('views','./views/pages')
app.set('view engine','jade')
var bodyParser= require('body-parser');

// 表单数据格式化
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'bower_components')))
app.listen(port)
console.log("sdddd")
app.set("port",3000)
//下面的代码意思是，get请求根目录
//则调用views文件夹中的index模板，
//并且传入参数title为“Express”，
//这个title就可以在模板文件中直接使用。
//index page
/*app.get('/', function (req, res) {
  res.render('index',{
  	title:'首页',
  	movies:[{
  		title:'机械',
  		_id:1,
  		poster:"dddd"
  	},{
  		title:'机械',
  		_id:2,
  		poster:"dddd"
  	},{
  		title:'机械',
  		_id:3,
  		poster:"dddd"
  	}]
  });
});*/

app.get('/', function (req, res) {
  Movie.fetch(function(err, movies){
  	  if(err){
          console.log(err)
  	  }
  	  res.render('index',{
		  	title:'首页',
		  	movies:movies
	   });

  })
  
});

//detail page
app.get('/detail/:id', function (req, res) {
    var id = req.params.id;
    Movie.findById(id, function (err, movie) {
        res.render('detail', {title: '电影-详情', movie: movie});
    })
});
var emptyMovie = {
    title: "",
    doctor: "",
    country: "",
    language: "",
    year: "",
    poster: "",
    summary: ""
};
//admin page
app.get('/admin/new', function (req, res) {
  res.render('admin', {title: '电影-后台录入页', movie: emptyMovie});
});
// 逻辑控制:插入
app.post('/admin/movie/new', function (req, res) {
	console.log("111")
    var movieObj = req.body.movie;
    var id = movieObj._id;
    var _movie;
    if (id != 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/detail/' + movie._id);
            });
        });
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/detail/' + movie._id);
        });
    }
});
//list page
app.get('/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {title:'电影-列表', movies: movies});
    });
});

// 逻辑控制:更新
app.get('/admin/control/update/:id', function (req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('new', {
                title: '后台更新页',
                movie: movie
            })
        })
    }
});
