import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private apiUrl = 'http://localhost/backendRallyFotografico';

  constructor(private http: HttpClient) {}

  uploadPhoto(photo: File, userId: number, rallyId: number) {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('user_id', userId.toString());
    formData.append('rally_id', rallyId.toString());

    return this.http.post(`${this.apiUrl}/upload_photo.php`, formData);
  }

  votePhoto(userId: number, photoId: number) {
    const data = new FormData();
    data.append('user_id', userId.toString());
    data.append('photo_id', photoId.toString());

    return this.http.post(`${this.apiUrl}/vote_photo.php`, data);
  }
}
