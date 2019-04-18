import ADHttp, {ADRequest} from "./index";

let req = ADRequest.get('https://jsonplaceholder.typicode.com/todos/1');
ADHttp.process(req)
    .then(response => response.body())
    .then(body => body.json())
    .then(json => {
        console.log(json)
    })
    .catch(console.error);
