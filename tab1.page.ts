import { Component } from '@angular/core';
import { Zip } from '@ionic-native/zip/ngx';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx'
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath  } from '@ionic-native/file-path/ngx';
import { InAppBrowser } from  '@ionic-native/in-app-browser/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {


  progress :any;
  constructor( private downloader : Downloader,
     private zip: Zip,
     public file : File,
     public filechooser: FileChooser,
     public filepath : FilePath,
     private iab: InAppBrowser,
     private fileopener : FileOpener,
     private webview: WebView

     ) {}

  ngOninit(){

  }

  download(){
     
    var url: "https://salestrip.blob.core.windows.net/tst-container/simpleWebsiteHTMLCSSJavaScricpt.zip";
     
    var request :DownloadRequest ={
      uri: "https://salestrip.blob.core.windows.net/tst-container/simpleWebsiteHTMLCSSJavaScricpt.zip",
      title: "testdownloads",
      description: "",
      mimeType: '',
      visibleInDownloadsUi : true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
      
        dirType: "Downloads",
        subPath : "simpleWebsiteHTMLCSSJavaScricpt.zip"
      },
      destinationInExternalPublicDir: {
        dirType: 'Downloads',
        subPath: 'simpleWebsiteHTMLCSSJavaScricpt.zip' //Path within the external directory, including the destination filename
      },
      destinationUri: 'Downloads'

    };

    this.downloader.download(request)
    .then((location: string) => console.log("File Downloaded at : " + location))
    .catch((error : any) => console.log(error));

  }

  unzipping(){
    
    this.filechooser.open().then((uri) => {
    this.progress = "uri="+ uri ;
      this.filepath.resolveNativePath(uri).then(
        (nativepath) => {

          this.progress = "nativepath = " +nativepath ;
          this.zip.unzip(nativepath, 
            this.file.externalRootDirectory,(progresstemp)  => {
              this.progress = "processing .........."

            }).then((result) => {
              if(result === 0) {

                this.progress = "unzip success";

              }

              else if(result===-1) {

                this.progress = "unzip failed";

              }
            }, (err)=> {
              alert(JSON.stringify(err));
            })
        },(err)=> {
          alert(JSON.stringify(err));
        }) 
    },(err)=> {
      alert(JSON.stringify(err));
    })
    

  }
  websiteopen(){
  
  this.iab.create('http://alights.in/test',
  '_blank',
  {
    location: 'no',
    clearcache: 'no',
    clearsessioncache: 'no',
     zoom : 'no',//Android only ,shows browser zoom controls 
  
 });

  }

  pickfile(){
    this.filechooser.open().then((fileuri) => {
      this.filepath.resolveNativePath(fileuri).then((nativepath) => {
        let filename = nativepath.substring(nativepath.lastIndexOf('/')+1);
        let folder = nativepath.substring(0,nativepath.lastIndexOf('/')+1);
        this.file.readAsDataURL(folder, filename).then((str)=> {
          var arr = str.split(';');
          var arr1 = arr[0].split(':');
          var mimetype = arr1[1]
          this.OpenFile(nativepath,mimetype);
        })
      })
    })
  }

OpenFile(filepath, mimetype){
this.fileopener.open(filepath, mimetype).then(() => {
}, (err) => {
  alert(JSON.stringify(err));
})

  }

  webpage(){

    this.webview.convertFileSrc('')

  }


}
