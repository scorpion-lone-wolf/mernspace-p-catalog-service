import app from "./app.js";



const startServer = ()=>{
    app.listen(5502, ()=>{
        console.log("Server is running on port 5502");
    });
}



startServer();
