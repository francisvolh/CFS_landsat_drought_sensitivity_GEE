/*
Assets
Alec L. Robitaille

*/



var list_assets_in_dir = function(dir) {
    return ee.data.listAssets(dir)['assets'];
};
exports.list_assets_in_dir = list_assets_in_dir;



var delete_assets_in_dir = function(dir) {
    list_assets_in_dir(dir)
        .map(function(d) { 
            ee.data.deleteAsset(d.name)
            return d.name 
        });
}
exports.delete_assets_in_dir = delete_assets_in_dir;