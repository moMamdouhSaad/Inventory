import {Server} from './Server/Server'
class Launcher{
    // Instance variables
    name:string;
    server:Server;

    constructor(){
        this.server = new Server();
        this.name='test server';
    }

    public launchApp():void{ 
        console.log('started app');
        this.server.createServer();
    }
}

new Launcher().launchApp();