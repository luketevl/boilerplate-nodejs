import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import multer from 'multer'
import { send, MailOptions, prepareAttachments } from './helpers/email'
 
const port = process.env.PORT || 3000
const allowedOrigins = process.env.NODE_ENV === 'dev' ? '*' : ['tagplus.com.br', 'gaterp.com.br', 'q4dev.com.br', 'tagsoft.com.br'];
const app =  express()
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, '/tmp')
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage, limits: { fieldSize: 25 * 1024 * 1024 } })
 
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
  
app.post('/', upload.any(), async (req, res)  => {
  try{ 
    if(req.files) {
      req.body.attachments = prepareAttachments(req.files as Array<Express.Multer.File>)
    }
     const result = await send(req.body as unknown as MailOptions);
     if(result.success){
      res.status(400).json(result);
     } else {
      res.status(202).json(result);
     }
  }
  catch(err){
    res.status(500).json(err);
  }
   
   
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})

export default app;
