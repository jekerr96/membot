const vkApi = require("node-vk-bot-api/lib/api");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const express = require("express");
const formData = require("express-form-data");
const os = require("os");
const app = express();
const port = 3000;

const User = require("./models/user");
const Mem = require("./models/mem");
const Bundle = require("./models/bundle");
const Audio = require("./models/audio");
const {defaultKeyboard} = require("./keyboards");

let userModel = new User();
let memModel = new Mem();
let audioModel = new Audio();
let bundleModel = new Bundle();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
};

// parse data with connect-multiparty.
app.use(formData.parse(options));
// delete from the request all empty files (size == 0)
app.use(formData.format());
// change the file objects to fs.ReadStream
app.use(formData.stream());
// union the body and the files
app.use(formData.union());

app.use(express.static('public'));

app.set("view engine", "pug");
app.disable('x-powered-by');

app.get("/", async (req, res) => {
    let bundle = await bundleModel.getAllElements();

    res.render("index", {title: "membot", message: "hello world", pageType: "main", bundles: bundle});
});

app.get("/bundle/", async (req, res) => {
    let audios = await audioModel.getAllElements();
    let mems = await memModel.getAllElements();

    res.render("bundle", {title: "Добавление набора", message: "Добавление набора", pageType: "bundle", audios, mems});
});

app.post("/bot/send-bundle-all/", async (req, res) => {
    let usersId = await userModel.getArrayUsersId();
    let msg = req.body.bundleText;
    let bundle = await bundleModel.getElementById(req.body.bundleId);

    if (!bundle) {
        req.send({
            success: false,
            errorMessage: "Набор не найден",
        });

        return;
    }

    let codes = await bundle.getCodesForSend();

    usersId.forEach(userId => {
        //какого то хрена сообщения не отправляются если делать это синхронно
        setTimeout(() => {
            global.vkBot.getBot().sendMessage(userId, msg, codes, defaultKeyboard);
        }, 1);
    });

    res.send({
        success: true,
    });
});

app.post("/bot/add-mem/", async (req, res) => {
    if (!Array.isArray(req.body.memFile)) {
        req.body.memFile = [req.body.memFile];
    }

    if (req.body.memFile.length > 5) {
        res.send({
            success: false,
            errorMessage: "Превышено максимальное количество файлов. Максимум 5",
        });

        return;
    }

    let memCodes = [];

    try {
        // url куда грузить картинки
        let resApi = await vkApi("photos.getMessagesUploadServer", {
            peer_id: 0,
            access_token: process.env.vk,
        });

        const formData = new FormData();

        req.body.memFile.forEach((file, index) => {
            formData.append("file" + index, fs.createReadStream(file.path));
        });

        // грузим картинки
        let ax = await axios.post(resApi.response.upload_url, formData, {
            headers: formData.getHeaders(),
        });

        resApi = await vkApi("photos.saveMessagesPhoto", {
            ...ax.data,
            access_token: process.env.vk
        });

        // формируем коды картинок для отправки в чате
        resApi.response.forEach(resItem => {
            memCodes.push({
                code: "photo" + resItem.owner_id + "_" + resItem.id,
                url: resItem.sizes[0].url
            });
        });

    } catch (e) {
        console.error(e);
        let message = e.message;

        if (e.response?.error_msg) {
            message = e.response.error_msg;
        }

        res.send({
            success: false,
            errorMessage: message,
        });

        return;
    }

    let result = await memModel.addItems(memCodes);

    res.send({
        success: result
    });
});

app.post("/bot/add-audio/", async(req, res) => {
    let audioCode = req.body.audio;
    let name = req.body.name;

    let result = await audioModel.addItem({
        code: audioCode,
        name,
    });

    res.send({
        success: result,
    });
});

app.post("/bot/add-bundle", async (req, res) => {
    let mems = req.body.mem || [];
    let audios = req.body.audios || [];
    let bundleName = req.body.name;

    if (!bundleName) {
        res.send({
            success: false,
            errorMessage: "Не указано название",
        });

        return;
    }

    if (!mems.length && !audios.length) {
        res.send({
            success: false,
            errorMessage: "Укажите хотя бы один мем или аудио",
        });

        return;
    }

    let result = await bundleModel.addItem({
        name: bundleName,
        mems,
        audios
    });

    res.send({
        success: result
    });
});

app.listen(port, () => {
    console.log(`server start on http://localhost:${port}`);
});