/**
 * Client, representing the player's client-side.
 * @constructor
 */
class Client {

    /**
     * @constructor
     * @param {port} port Server port
     */
    constructor(port) {
        this.port = port || 8081;
    };

    getPrologRequest(requestString, onSuccess, onError) {
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + 8081 + '/' + requestString, true);
    
        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };
    
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    handleReply(data) {
        console.log(data.target.response)
        return data.target.response
    }
}
