    var product = null;
    //Download file
    function download(url, filename) {
        fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        })
        .catch(console.error);
    }
    
    function extractData() {
        //Get full url
        var fullUrl = window.location.href;

        //Get path & extract shop id, product id
        var pathName = window.location.pathname;
        var path = pathName.split(".");
        if(path.length == 1) {
            path = pathName.split("/");// '/product/629663188/19678049189'
            path.shift();//remove first item  ['', 'product', '629663188', '19678049189']
        }
        var shopId = path[1];
        var productId = path[2];

        //Create short url
        var shortUrl = "https://shopee.vn/" + shopId + "/" + productId;

        //Get product name
        var productName = '';
        if(document.getElementsByClassName("_44qnta").length > 0) {
            var productName = document.getElementsByClassName("_44qnta")[0].getElementsByTagName("span")[0].innerText;
        } else {
            return null;
        }

        //Get video url
        var videoUrl = document.getElementsByTagName("video")[0].src;

        //Get product description
        var productDescription = '';
        var content = document.getElementsByClassName("irIKAp");
        for (var i = 0; i < content.length; i++) {
            productDescription += content.item(i).textContent;
        }

        var fileName = [shopId, productId, productName].join('.');

        //Create product object
        var product = {
            fullUrl: fullUrl,
            shortUrl: shortUrl,
            pathName: pathName,
            videoUrl: videoUrl,
            productName: productName,
            productDescription: productDescription,
            shopId: shopId,
            productId: productId,
            fileName: fileName,
        };

        return product;
    }

    function copyTextToClipboard(text) {
        //Create a textbox field where we can insert text to. 
        var copyFrom = document.createElement("textarea");
      
        //Set the text content to be the text you wished to copy.
        copyFrom.textContent = text;
      
        //Append the textbox field into the body as a child. 
        //"execCommand()" only works when there exists selected text, and the text is inside 
        //document.body (meaning the text is part of a valid rendered HTML element).
        document.body.appendChild(copyFrom);
      
        //Select all the text!
        copyFrom.select();
      
        //Execute command
        document.execCommand('copy');
      
        //(Optional) De-select the text using blur(). 
        copyFrom.blur();
      
        //Remove the textbox field from the document.body, so no other JavaScript nor 
        //other elements can get access to this.
        document.body.removeChild(copyFrom);
    }

    // JSON to CSV Converter
    function ConvertToCSV(item) {
        var json = [item];
        var fields = Object.keys(json[0])
        var replacer = function(key, value) { return value === null ? '' : value } 
        var csv = json.map(function(row){
        return fields.map(function(fieldName){
            return JSON.stringify(row[fieldName], replacer)
        }).join(',')
        })
        //csv.unshift(fields.join(',')) // add header column
        csv = csv.join('\r\n');
        console.log(csv);
        return csv;
    }    

    function getData() {
        if(window.location.hostname == 'shopee.vn') {           
            product = extractData();
            console.debug(product);
            if(product == null) {
                alert("Unable to export!");
                if (confirm("Unable to export! Re-extract?") == true) {
                    getData();
                } else {
                    return;
                }
            }
            if(product != null && product.videoUrl == "") {
                alert("There is no video in the product!");
                return;
            }
            //Copy to clipboard
            //copy(JSON.stringify(product));
            //copyTextToClipboard(JSON.stringify(product));

            //Download video product
            download(product.videoUrl, product.fileName + ".mp4");

            //Download content product
            download("data:text/html," + JSON.stringify(product), product.fileName + ".txt");
            console.log(ConvertToCSV(product));
            
            download("data:text/html," + ConvertToCSV(product), product.fileName + ".csv");


            setTimeout(function(){
                self.close();
            },10000);
        }
    }

    setTimeout(function(){
        product = null;
        getData();
    },5000);