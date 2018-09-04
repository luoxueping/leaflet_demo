function TDTLayer(type,options){
    this.subdomains=new Array("t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7");
    options.subdomains= this.subdomains;
    this.options=options;
    this.getTileUrl=function(type){
         var url = "";
        if(type=="tdtmap"){
             url="http://{s}.tianditu.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"

        }
        if(type == "tdtmapi"){
            url="http://{s}.tianditu.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"
                       
        }
        if(type == "tdtimg"){
            url="http://{s}.tianditu.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"

        }
         if(type == "tdtimgi"){
            url="http://{s}.tianditu.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"

        }
        return url;
    };
    return L.tileLayer(this.getTileUrl(type),this.options);

}

