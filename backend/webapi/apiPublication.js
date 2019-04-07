const app = express()

app.route('/publication')
    .get(function(req, res){
        console.log('publication GET');
    })
    .post(function(req, res){
        console.log('publication POST');
    })
    .put(function(req, res){
        console.log('publication PUT');
    })