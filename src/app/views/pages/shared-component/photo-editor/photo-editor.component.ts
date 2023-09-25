import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
// import { ToastUiImageEditorComponent } from 'ngx-tui-image-editor';
import { ProductService } from "../../../../../provider/product-service/product-service.service";
import { Dimensions, ImageCroppedEvent, ImageTransform } from '../image-cropper/interfaces/index';
import { base64ToFile } from '../image-cropper/utils/blob.utils';
import {NgxImageCompressService} from 'ngx-image-compress';

// import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
	selector: 'kt-photo-editor',
	templateUrl: './photo-editor.component.html',
	styleUrls: ['./photo-editor.component.scss']
})


export class PhotoEditorComponent implements OnInit {
	@Input() width: any = 300;
	@Input() height: any = 300;
	@Output() valueChange = new EventEmitter();
	@Output() validImageQuality = new EventEmitter();
	imageChangedEvent: any = '';
	croppedImage: any = '';
	canvasRotation = 0;
	rotation = 0;
	scale = 1;
	showCropper = false;
	containWithinAspectRatio = false;
	transform: ImageTransform = {};
	imageSize: any = {
		width: 300,
		height: 300
	}
	elements: any;
	fileName: any;
	totalSize:any;


	constructor(
		public toastr: ToastrService,
		private service: ProductService,
		public dialogRef: MatDialogRef<PhotoEditorComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private imageCompress: NgxImageCompressService
	) {

	}

	ngOnInit() {
		if (this.data) {
			this.imageChangedEvent = this.data;
		}
	}

	fileChangeEvent(event: any): void {
		this.imageChangedEvent = event;
	}

	imageCropped(event: ImageCroppedEvent) {
		this.croppedImage = event.base64;
		this.imageSize.width=event.width;
		this.imageSize.height=event.height;
		let info:any=base64ToFile(event.base64);
		console.log(info.size);
		this.totalSize=info.size
	}

	imageLoaded() {
		this.showCropper = true;
		console.log('Image loaded');
	}

	cropperReady(sourceImageDimensions: Dimensions) {
		console.log('Cropper ready', sourceImageDimensions);
	}

	loadImageFailed() {
		console.log('Load failed');
	}

	rotateLeft() {
		this.canvasRotation--;
		this.flipAfterRotate();
	}

	rotateRight() {
		this.canvasRotation++;
		this.flipAfterRotate();
	}

	private flipAfterRotate() {
		const flippedH = this.transform.flipH;
		const flippedV = this.transform.flipV;
		this.transform = {
			...this.transform,
			flipH: flippedV,
			flipV: flippedH
		};
	}


	flipHorizontal() {
		this.transform = {
			...this.transform,
			flipH: !this.transform.flipH
		};
	}

	flipVertical() {
		this.transform = {
			...this.transform,
			flipV: !this.transform.flipV
		};
	}

	resetImage() {
		this.scale = 1;
		this.rotation = 0;
		this.canvasRotation = 0;
		this.transform = {};
	}

	zoomOut() {
		this.scale -= .1;
		this.transform = {
			...this.transform,
			scale: this.scale
		};
	}

	zoomIn() {
		this.scale += .1;
		this.transform = {
			...this.transform,
			scale: this.scale
		};
	}

	toggleContainWithinAspectRatio() {
		this.containWithinAspectRatio = !this.containWithinAspectRatio;
	}

	updateRotation() {
		this.transform = {
			...this.transform,
			rotate: this.rotation
		};
	}

	async download(image) {
	  if (image) {
			if(this.totalSize<1200000){
				const blob = new File([this.convertDataUrlToBlob(image)], this.data.target.files[0].name, { type: this.data.target.files[0].type });
				console.log(blob);
				let reader = new FileReader();
				reader.onload = (e: any) => { };
				reader.readAsDataURL(blob);
				this.dialogRef.close({ event: blob, imageSize: this.imageSize })
			}
			else{
				this.imageCompress.compressFile(image, null, 30, 90).then(
					result => {
						console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
						const blob = new File([this.convertDataUrlToBlob(result)], this.data.target.files[0].name, { type: this.data.target.files[0].type });
						console.log(blob);
						let reader = new FileReader();
						reader.onload = (e: any) => { };
						reader.readAsDataURL(blob);
						this.dialogRef.close({ event: blob, imageSize: this.imageSize })
					}
				);
			}
		
	    // const blob = this.b64toArrayBuffer(this.editorComponent.editorInstance.toDataURL());
	  }
	}



	convertDataUrlToBlob(dataUrl): Blob {
	  const arr = dataUrl.split(',');
	  const mime = arr[0].match(/:(.*?);/)[1];
	  const bstr = atob(arr[1]);
	  let n = bstr.length;
	  const u8arr = new Uint8Array(n);

	  while (n--) {
	    u8arr[n] = bstr.charCodeAt(n);
	  }

	  return new Blob([u8arr], { type: mime });
	}


	// fileChangeEvent(fileInput: any) {
	//   this.fileName = fileInput.target.files[0]

	//   if (fileInput.target.files && fileInput.target.files[0]) {
	//     // Size Filter Bytes
	//     const max_height = 300;
	//     const max_width = 300;
	//     let img_height;
	//     let img_width;

	//     const reader = new FileReader();
	//     reader.onload = (e: any) => {
	//       const image = new Image();
	//       image.src = e.target.result;
	//       image.onload = rs => {
	//         img_height = rs.currentTarget['height'];
	//         img_width = rs.currentTarget['width'];

	//         console.log("======>", img_height, img_width);


	//         if (img_height < max_height || img_width < max_width) {
	//           this.imageSize.width = img_width;
	//           this.imageSize.height = img_height
	//           this.toastr.error('Please add 300x300 resolution Image, Its better impact on Product/Service in the search page.')
	//           return false;
	//         } else {
	//           const imgBase64Path = e.target.result;

	//           // this.previewImagePath = imgBase64Path;
	//         }
	//       };
	//     };
	//     reader.readAsDataURL(fileInput.target.files[0]);
	//     this.imageChangedEvent = fileInput;

	//   }
	// }

	// imageCropped(event) {
	//   debugger
	//   this.valueChange.emit({ event: event, imageSize: this.imageSize })
	//   this.base64 = event.base64;
	//   console.log("image", event);

	// }


}
