import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    standalone: false
})
export class ProfileComponent implements OnInit {
  user: any = {};
  oldPassword: string = '';
  newPassword: string = '';
  passwordChangeMessage: string = '';
  error: string = '';
  isChangePasswordModalVisible: boolean = false;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(
      user => {
        this.user = user;
        if (this.user.profilePicture) {
          this.user.profilePicture = `http://localhost:3000${this.user.profilePicture}`;
        }
      },
      error => {
        console.error('Error fetching profile:', error);
        this.error = 'Error fetching profile: ' + error.message;
      }
    );
  }

  showChangePasswordModal(): void {
    this.isChangePasswordModalVisible = true;
  }

  closeChangePasswordModal(): void {
    this.isChangePasswordModalVisible = false;
  }

  onChangePassword(): void {
    this.profileService.changePassword(this.oldPassword, this.newPassword).subscribe(
      response => {
        this.passwordChangeMessage = 'Password changed successfully';
        this.oldPassword = '';
        this.newPassword = '';
        setTimeout(() => {
          this.passwordChangeMessage = '';
          this.closeChangePasswordModal();
        }, 2000);
      },
      error => {
        console.error('Error changing password:', error);
        this.passwordChangeMessage = 'Error changing password: ' + error.message;
      }
    );
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.profileService.uploadProfilePicture(file).subscribe(
        response => {
          this.user.profilePicture = `http://localhost:3000${response.profilePicture}`;
        },
        error => {
          console.error('Error uploading profile picture:', error);
        }
      );
    }
  }
}
