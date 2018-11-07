import { Component, OnInit } from '@angular/core';
import { UploadEvent } from 'ngx-file-drop';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  imageUrl;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore) { }

  ngOnInit() {
  }

  dropped(event: UploadEvent, isFeature = false) {
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry: any = droppedFile.fileEntry;
        fileEntry.file((file: File) => {

          const filePath = `image/image`;
          const task = this.storage.upload(filePath, file);
          task.then(a => {
            return a.ref.getDownloadURL();
          })
          .then(url => {
            console.log(url);
            this.imageUrl = url;
          });

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry: any = droppedFile.fileEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  

  // save() {

  //   let save$ = Promise.resolve();

  //   if (this.pendingImage) {
  //     const filePath = `article-images/${this.articleId}`;
  //     const task = this.storage.upload(filePath, this.pendingImage);
  //     save$ = save$.then(() => task).then(a => {
  //       return a.ref.getDownloadURL();
  //     })
  //     .then(url => {
  //       this.article.image_url = url;
  //     });
  //   }

  //   if (this.pendingImage_feature) {
  //     const filePath = `article-images/${this.articleId}_feature`;
  //     const task = this.storage.upload(filePath, this.pendingImage_feature);
  //     save$ = save$.then(() => task).then(a => {
  //       return a.ref.getDownloadURL();
  //     })
  //     .then(url => {
  //       this.article.image_url_feature = url;
  //     });
  //   }

  //   save$.then(() => {
  //     return this.articleRef.set(this.article);
  //   })
  //   .then(() => {
  //     alert('Save Successful');
  //   });
  // }

}
