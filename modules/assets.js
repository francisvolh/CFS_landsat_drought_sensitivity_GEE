/*
Assets
Alec L. Robitaille

*/

var delete_assets_in_dir = function(dir) {
    var assetList = ee.data.listAssets(dir)['assets']
                        .map(function(d) { 
                            ee.data.deleteAsset(d.name)
                            return d.name 
                        });
                    
}
exports.delete_assets_in_dir = delete_assets_in_dir;