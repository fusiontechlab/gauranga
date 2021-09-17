const express = require( 'express' );
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );

const router = express.Router();
require('dotenv').config();

/**
 * PROFILE IMAGE STORING STARTS
 */
const s3 = new aws.S3({
	accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
	secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY_ID}`,
	bucket: `${process.env.AWS_BUCKET_NAME}`,
});

/**
 * Single Upload
 */
const pdfUpload = multer({
	storage: multerS3({
		s3: s3,
		bucket: `${process.env.AWS_BUCKET_NAME}`,
		acl: 'public-read',
		key: function (req, file, cb) {
			cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
		}
	}),
	limits:{ fileSize: 5000000 }, // In bytes: 2000000 bytes = 2 MB
	fileFilter: function( req, file, cb ){
		checkFileType( file, cb );
	}
});

/**
 * Check File Type
 * @param file
 * @param cb
 * @return {*}
 */
function checkFileType( file, cb ){
	// Allowed ext
	const filetypes = /pdf|.pdf/;
	// Check ext
	const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
	// Check mime
	const mimetype = filetypes.test( file.mimetype );
	if( mimetype && extname ){
		return cb( null, true );
	} else {
		cb( 'Error: Pdf Only!' );
	}
}
module.exports = pdfUpload