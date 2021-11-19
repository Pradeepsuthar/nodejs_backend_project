var fs = require('fs');

MasterService = {

    // Delete files from file system
    Delet_File_From_System(filePath) {
        const image_URL = `${appRoot}/${filePath}`;
        fs.unlink(image_URL, (err) => {
            if (err) { return next(CustomErrorHandler.serverError(err.message)); }
        });
    }

}

module.exports = MasterService;