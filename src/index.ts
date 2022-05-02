import 'dotenv/config'
import cors from 'cors'
import express from 'express'
 
const port = process.env.PORT || 3000
const allowedOrigins = process.env.NODE_ENV === 'dev' ? '*' : ['*'];
const app =  express()
 
app.use(cors({
    origin: function(origin, callback){
      // allow requests with no origin 
      // (like mobile apps or curl requests)
      if(!origin || allowedOrigins === '*') return callback(null, '*');
      if(allowedOrigins.some(or => origin.includes(or))){
        return callback(null, '*');
        
      } else if(process.env.ENV === 'dev'){
        return callback(null, '*');
      }else {
        var msg = 'The CORS policy for this site does not allow access from the specified Origin. ;(';
        return callback(new Error(msg), false);
      }
      
    }
  }))

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})

export default app;
