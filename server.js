const express=require('express');
const app=express();
app.use(express.static(__dirname+"/public"));
// app.listen(3000, ()=>{
// 	console.log('Servidor encendido! en el puerto 3000');
// });
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
