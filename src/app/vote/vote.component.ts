import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {

  voters;
  results;

  constructor(private db: AngularFirestore) {
    this.loadData();
  }

  ngOnInit() {
  }

  vote(name: string, color: string) {
    this.db.collection('votes').doc(name.toLowerCase()).set({
      color: color
    });
  }

  reset() {
    this.db.collection('votes').get()
    .subscribe(votes => {
      votes.forEach(v => this.db.doc(`votes/${v.id}`).delete());
    });
    this.db.doc('stats/votes').set({});
  }

  loadData() {
    this.results = this.db.doc('stats/votes').valueChanges()
    .pipe(
      map(votes => {
        return Object.keys(votes || {}).map(k => {
          return {color: k, count: votes[k]};
        })
        .sort((a, b) => b.count - a.count);
      })
    );

    this.voters = this.db.collection('votes').snapshotChanges()
    .pipe(
      map(voters => {
        return voters.map(v => {
          return {
            name: v.payload.doc.id,
            color: v.payload.doc.data()['color']
          };
        });
      })
    );
  }
}
