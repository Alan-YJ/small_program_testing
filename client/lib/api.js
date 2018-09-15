const QQ_MAP_KEY = 'GR2BZ-CBH65-POOI5-QXLWX-C6A57-NEFWV'

export const geocoder = (lat,lon,success=()=>{},fail=()=>{})=>{
    return wx.request({
        url:'https://apis.map.qq.com/ws/geocoder/v1/',
        data:{
            location:`${lat},${lon}`,
            key:QQ_MAP_KEY,
            get_poi:0
        },
        success,
        fail
    })
}