import express from 'express';
import authenticate from '../middlewares/authenticate';
import File from '../models/file';
import formidable from "formidable";
import path from "path";
import fs from 'fs';

let router = express.Router();

//请求处理必须经过这个中间件
//主要用来处理权限验证，如果通过中间件的验证，才能继续后面的响应
const validate = (data) => {
    let errors = {};
    if (data.fileTitle === '') errors.fileTitle = "Can't be empty";
    if (data.fileImage === '') errors.fileImage = "Can't be empty";
    if (data.fileDescription === '') errors.fileDescription = "Can't be empty";
    if (data.fileReadPrice === '') errors.fileReadPrice = "Can't be empty";
    if (data.fileRightPrice === '') errors.fileRightPrice = "Can't be empty";

    const isValid = Object.keys(errors).length === 0;
    return {errors, isValid}
};

router.get('/', (req, res) => {
    File.forge().fetchAll().then(resource => {
        res.json({resources: resource});
    }).catch(err => res.status(500).json({errors: {global: "something went wrong"}}));
});

router.get('/:id', (req, res) => {
    File.forge()
        .where('id', '=', req.params.id)
        .fetch().then(resource => res.json({resources: resource}))
        .catch(err => res.status(500).json({errors: {global: "something went wrong"}}));
});

router.put('/:id', (req, res) => {
    const {errors, isValid} = validate(req.body);
    if (isValid) {
        const {fileTitle, fileImage, fileDescription, fileReadPrice, fileRightPrice} = req.body;
        console.log(req.body);

        File.forge()
            .where('id', '=', req.params.id)
            .save({
                fileTitle: fileTitle,
                fileImage: fileImage,
                fileDescription: fileDescription,
                fileReadPrice: fileReadPrice,
                fileRightPrice: fileRightPrice
            }, {patch: true}).then(resource => res.json({resource: resource}))
            .catch(err => res.status(500).json({errors: {global: "something went wrong!!"}}));
    } else {
        res.status(404).json({errors});
    }
});

router.post('/', (req, res) => {
    console.log(req.body);
    console.log("ok");

    const form = new formidable.IncomingForm();
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = 'FileUpload/'; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.multiples = true; //设置为多文件上传
    form.maxFieldsSize = 10 * 1024 * 1024; //文件大小10mb

    form.parse(req, (err, fields, files) => {
         if (err) {
             console.log(err.message);
         }

         console.log(files);
         console.log(fields);

         res.json({success: "OK"})
     });

    const {errors, isValid} = validate(req.body);
    if (isValid) {
        const {fileTitle, fileImage, fileDescription, fileReadPrice, fileRightPrice} = req.body;

        return File.forge({
            fileTitle: fileTitle,
            fileImage: fileImage,
            fileDescription: fileDescription,
            fileReadPrice: fileReadPrice,
            fileRightPrice: fileRightPrice
        }, {hasTimestamps: true}).save()
            .then(resource => res.json({resource: resource}))
            .catch(err => res.status(500).json({errors: {global: "something went wrong!"}}));
    } else {
        res.status(404).json({errors});
    }
});

router.delete('/:id', (req, res) => {
    File.forge()
        .where('id', '=', req.params.id)
        .destroy().then(res.json({}))
        .catch(err => res.status(500).json({errors: {global: "something went wrong"}}));
});

router.use((req, res) => {
    res.status(404).json({
        errors: {
            global: "Still working on it, Please try again later than when we implement it "
        }
    })
});

export default router;