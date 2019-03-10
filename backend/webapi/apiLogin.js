const app = express()

app.route('/login')
    .get(function(req, res){
        console.log('login GET');
    })
    .post(function(req, res){
        console.log('login POST');
    })
    .put(function(req, res){
        console.log('login PUT');
    })