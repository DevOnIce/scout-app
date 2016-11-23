(function () {

    var $ = window.$;
    var scout = window.scout;
    var ugui = window.ugui;

    var fs = require('fs-extra');
    var nw = require('nw.gui');
    var modal = $('#drag-in-folders')[0];

    // send files to the not already running app
    // ("Open With" or drag-n-drop)
    if (ugui.app.argv.length) {
        var files = ugui.app.argv.map(function (path) {
            return {
                path: path
            };
        });

        onFilesDrop(files);
    }

    // send files to the already running app
    // ("Open With" or drag-n-drop)
    nw.App.on('open', function (path) {
        onFilesDrop([{
            path: path
        }]);
    });


    function showModal () {
        modal.style.visibility = 'visible';
    }
    function hideModal () {
        modal.style.visibility = 'hidden';
    }

    function allowDrag (evt) {
        evt.dataTransfer.dropEffect = 'copy';
        evt.preventDefault();
    }

    function handleDrop (evt) {
        evt.preventDefault();
        var files = [].slice.call(evt.dataTransfer.files);
        onFilesDrop(files);
        hideModal();
    }

    window.addEventListener('dragenter', function () {
        showModal();
    });
    //modal.addEventListener('dragenter', allowDrag);
    window.addEventListener('dragover', allowDrag);
    modal.addEventListener('dragleave', function () {
        hideModal();
    });
    modal.addEventListener('drop', handleDrop);

    /**
     * Actions to perform when new files are imported
     * @param  {array} files A list of folders
     */
    function onFilesDrop (folders) {
        var multiImportModalIsVisible = $('#multi-import-modal:visible').length > 0;
        for (var i = 0; i < folders.length; i++) {
            var folder = folders[i].path;
            var isFolder = fs.lstatSync(folder).isDirectory();
            if (isFolder && multiImportModalIsVisible) {
                scout.helpers.addItemToMultiImportModal(folder);
            } else if (isFolder) {
                scout.helpers.autoGenerateProject(folder);
            }
        }

        ugui.app.argv = [];
    }

})();
