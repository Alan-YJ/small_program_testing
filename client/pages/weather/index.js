Page({
    data:{
        backgroundImage:'../../images/cloud.jpg',
        backgroundColor:'#62aadc',
        "air":{
            "status":0,
            "aqi":'77',
            "color":"#00cf9a",
            "name":'良'
        },
        "current":{
            "backgroundImage":"https://tianqi-1d3bf9.tcb.qcloud.la/bg/day/overcast.jpg",
            "backgroundColor":"#5c7a93",
            "temp":"35",
            "wind":"南风",
            "windLevel":"1",
            "weather":"阴",
            "humidity":"73",
            "icon":"tianqi-yintian",
            "ts":"2018-08-12 14:54"
        },
        "today":{
            "temp":"24/30°",
            "icon":"tianqi-leizhenyu",
            "weather":"雷阵雨"
        },
        "tomorrow":{
            "temp":"24/30°",
            "icon":"雷阵雨",
            "weather":"雷阵雨"
        },
        "hourlyData":[
            {
                "temp":"29",
                "time":"16:00",
                "weather":"雷阵雨",
                "icon":"tianqi-leizhenyu"
            }
        ],
        "weeklyData":[
            {
                "day":"雷阵雨",
                "dayIcon":"tianqi-leizhenyu",
                "datWind":"南风",
                "dayWindLevel":"1-2",
                "maxTemp":"30",
                "minTemp":"24",
                "night":"中雨",
                "nightIcon":"阵雨夜",
                "nightWind":"南风",
                "nightWindLevel":"1-2",
                "time":153403200000
            }
        ],
        "leftStyle":[
            {
                "name":"舒适度",
                "icon":"guominzhishu",
                "info":"较不舒适",
                "detail":"白天虽然有雨，但仍无法削弱较高气温带来的暑意，同时降雨造成湿度加大会您感到有些闷热，不很舒适。"
            }
        ]
    },
    onLoad(){
        this.getLocation()
        wx.getSystemInfo({
            success:(res)=>{
                this.setData({
                    paddingTop:res.statusBarHeight+12
                })
            }
        })
    },
    getAddress(lat,lon,name){
        wx.showLoading({
            title:'定位中',
            mask:true
        })
        let fail = (e)=>{
            this.setData({
                address: name||'湖北省武汉市汉阳区'
            })
            wx.hideLoading()
            this.getWeatherData()
        }
        geocoder(lat,lon,(res)=>{ 
            wx.hideLoading()
            let result = (res.data||{}).result

            if(res.statusCode===200&&result&&result.address){
                let {address,formatted_addresses,address_component} = result
                if(formatted_addresses&&(formatted_addresses.recommend||formatted_addresses.rough)){
                    address = formatted_addresses.recommend||formatted_addresses.rough
                }
                let {province,city,district: county} = address_component
                this.setData({
                    province,county,city,address: name||address
                })
                this.getWeatherData()
            }else{
                fail()
            }
        },fail)
    },

    updateLocation(res){
        let {latitude:lat,longitude:lon,name} = res
        let data={lat,lon}
        if(name){
            data.address = name
        }
        this.setData(data)
        this.getAddress(lat,lon,name)
    },

    getLocation(){
        wx.getLocation({
            type:'gcj02',
            success:this.updateLocation,
            fail:(e)=>{
                this.openLocation()
            }
        })
    },

    openLocation(){
        wx.showToast({
            title: '检测到您未授权使用位置权限，请先开启哦',
            icon: 'none',
            duration: 3000
        })
    },

    chooseLocation(){
        wx.chooseLocation({
            success:(res)=>{
                let {latitude,longitude} = res
                let {lat,lon} = this.data
                if(latitude == lat&&lon == longitude){
                    this.getWeatherData()
                }else{
                    this.updateLocation(res)
                }
            }
        })
    }
})