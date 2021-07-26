import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,FlatList,Pressable,Modal
} from 'react-native';

import * as rssParser from 'react-native-rss-parser';
import  SQLite  from 'react-native-sqlite-storage';
import MapView, {Marker,PROVIDER_GOOGLE} from 'react-native-maps';

  
  const latitudeList = [];   //enlem
  const longitudeList = [];   //boylam
  const publishedList = [];    //tarih
  const titleList = [];    //konum
  const mlList = [];      //buyukluk
  const deepList = []; 

  var color;
  

  let helperArray = [];

  var latitudeData;
  var longtitudeData;
  const db = SQLite.openDatabase(
    {
      name :'EarthQuakeDataBase',
      location:'default',
    }, () => {
      console.log('Database açma başarılı')
  
    }, (err) => {
      console.log('Database açma başarısız')
    });
  
    var color;



  export default class HomeScreen extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        data : [],
        visibility : false,
        latitude : 0,
        longtitude : 0,
        konum : "",
        saat : "",
        derinlik : null,
        buyukluk : null,
        enlem : 0,
        boylam : 0,
      };
    }
  
  
    componentDidMount() {
      fetch('http://koeri.boun.edu.tr/rss/')
      .then((response) => response.text())
      .then((responseData) => rssParser.parse(responseData))
      .then((rss) => {
        for(var i = 0 ; i < rss.items.length ; i++){
          latitudeList[i] = parseFloat(rss.items[i].description.substring(29,36));
        }
        for(var i = 0 ; i < rss.items.length ; i++){
          longitudeList[i] = parseFloat(rss.items[i].description.substring(37,44));
        }
        for(var i = 0 ; i < rss.items.length ; i++){
          publishedList[i] = rss.items[i].published.substring(5,25);
        }
        for(var i = 0 ; i < rss.items.length ; i++){
          var result = rss.items[i].title.search("2021");
          titleList[i] = rss.items[i].title.substring(9,result-1);
        }
        for(var i = 0 ; i < rss.items.length ; i++){
          mlList[i] = parseFloat(rss.items[i].description.substring(20,23));
        }
        for(var i = 0 ; i < rss.items.length ; i++){
          deepList[i] = parseFloat(rss.items[i].description.substring(45,48));
        }

        
        this.createRecord();
        this.readRecord();
        
        
      })
  
      
      db.transaction((tx) =>{
          tx.executeSql('DROP TABLE data',[],(tx,result) =>{
          })
      }) 
      
  
      db.transaction((tx) =>{
        tx.executeSql("CREATE TABLE IF NOT EXISTS data (ID INTEGER PRIMARY KEY AUTOINCREMENT, Konum VARCHAR(50), Tarih VARCHAR(50), Enlem INTEGER, Boylam INTEGER, Buyukluk INTEGER, Derinlik INTEGER)",[],(tx,result) =>{

        })
      })
    }
    
  
    createRecord = () => {
      for (let index = 0; index < 70; index++) { 
        db.transaction((tx) =>{
          tx.executeSql('INSERT INTO data (Konum, Tarih, Enlem, Boylam, Buyukluk, Derinlik) VALUES(?,?,?,?,?,?)',[titleList[index],publishedList[index],latitudeList[index],longitudeList[index],mlList[index],deepList[index]],(tx,result) =>{

            })
          })
        
        }
    }
  
    readRecord = () => {
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM data',[],(tx,result) =>{
          
            var dbDatalength = result.rows.length;

            if(dbDatalength > 0){
              
              for(let i = 0 ; i < result.rows.length ; i++){
                helperArray.push(result.rows.item(i));
                
              }
              this.setState({
                data : helperArray,
              });
            }
          
        })
      })
    }
  
    rgbCode(deger){
      if(deger>=2 && deger<3){
        color = '#fde910'
      }
      if(deger<2){
        color = '#00A611';
      }
      if(deger>=3 && deger<5){
        color = '#FA8E00'
      }  
      if(deger>5){
        color = '#CF0015'
      }
      }
      

      changeModalVisible = (visible) => {
        this.setState({
          visibility : visible,
        });
      }

      fonksiyon(){
        this.state.data.map((item,index) => {
          if (item.ID == 0){
            this.setState({
              latitude : item.enlem,
              longitude : item.boylam,
            })
          }
        })
      }
    itemData(konum,saat,derinlik,buyukluk,enlem,boylam) {
      this.setState({
        konum : konum,
        saat : saat,
        derinlik : derinlik,
        buyukluk : buyukluk,
        enlem : enlem ,
        boylam : boylam,
      })
    }     
    
    functionComplied(visible,konum,saat,derinlik,buyukluk,enlem,boylam){
      this.changeModalVisible(visible);
      this.itemData(konum,saat,derinlik,buyukluk,enlem,boylam);
    }

    render() {  
      const {visibility,konum,saat,derinlik,buyukluk,enlem,boylam , latitude,longtitude} = this.state;
      return (
        <View style = {styles.container}>
          <View style= {styles.topBar}>
            <Text style = {styles.topBarText}>Ana Sayfa</Text>
          </View>
            <View style = {{flexDirection : 'column'}}>
              <View style = {[styles.mapViewStyle]}>
                <MapView
                style = {{height : 270}}
                initialRegion={{
                    latitude: 39.920673,
                    longitude: 32.844467,
                    latitudeDelta: 0.5,
                    longitudeDelta: 20,
                }}>
      
                {
                  this.state.data.map((item,index) => (
                      <Marker key = {index} coordinate={{ latitude :  item.Enlem, longitude : item.Boylam}} >
                          <Image style = {{width : 20 , height : 20}} source = {require('../images/marker.png')} />
                      </Marker>
                  ))
                }
                
                </MapView>
              </View >
              <Modal
                animationType="slide"
                transparent={true}
                visible = {visibility}
                onRequestClose = {() => {this.changeModalVisible(!visibility);}}
              >
                <View style = {styles.centeredTwoView}>
                  <View style = {styles.modalTwoView}>
                    <View style = {[styles.mapViewStyle , {top : 10}]}>
                        <MapView
                            style = {{height : 450}}
                            initialRegion={{
                                latitude: enlem,
                                longitude: boylam,
                                latitudeDelta: 0.5,
                                longitudeDelta: 0.9,
                        }}>
          
                          <Marker coordinate={{ latitude :  enlem, longitude : boylam }} >
                            <Image source = {require('../images/marker.png')} />
                          </Marker>
                    
                        </MapView>
                    </View >
                    <View style = {styles.informationView}>
                        <View>
                          <View style = {{flexDirection : 'row' ,margin : 15 ,marginBottom : 13}}>
                            <Image style = {{width : 20 ,height : 20 , marginTop : 4 , marginRight : 5}} source = {require('../images/placeholder.png')} />
                            <Text style = {{fontWeight : 'bold' , fontSize : 20 , maxWidth : 215}}>{konum}</Text>
                          </View>
                          <View style = {{flexDirection : 'row' ,margin : 10 , marginLeft : 15}}>
                          <Image style = {{width : 20 ,height : 20 , marginTop : 4 , marginRight : 10}} source = {require('../images/clock.png')} />
                            <Text style = {{ fontSize : 13 , color : '#666666' , marginTop : 5}}>{saat}</Text>
                          </View>
                          <View style = {{flexDirection : 'row' ,margin : 10 ,marginLeft : 15}}>
                          <Image style = {{width : 20 ,height : 20 , marginTop : 4 , marginRight : 10}} source = {require('../images/seismic-graph.png')} />
                            <Text style = {{ fontSize : 13 , color : '#FF4848' , marginTop : 5}}>Derinlik : {derinlik} km</Text>
                          </View>
                          <View style = {{flexDirection : 'row' ,margin : 10 ,marginLeft : 15}}>
                          <Image style = {{width : 20 ,height : 20 , marginTop : 4 , marginRight : 10}} source = {require('../images/compass.png')} />
                            <Text style = {{ fontSize : 15 , color : '#666666' , marginTop : 4}}>{enlem}°N  {boylam}°E</Text>
                          </View>
                        </View>
                        {
                          this.rgbCode(buyukluk)
                        }
                        <View style = {{width : 90 ,backgroundColor : color , height : '100%' , borderTopRightRadius : 25 , alignItems : 'center' , justifyContent : 'center'}}>
                          <Text style = {{color :'white', fontSize : 35 , fontFamily : 'roboto' }}>{buyukluk}</Text>
                        </View>
                    </View>
                    <Pressable
                    style = {{bgcolor : 'blue',top : 700, }}
                      onPress={() => this.changeModalVisible(!visibility)}
                    >
                      <Image  source = {require('../images/down-arrow.png')}
                              resizeMode = 'contain' 
                              style = {{width : 50 , height : 50}}
                              />
                    </Pressable>
                  </View>  
                </View>
              </Modal>
              <View style = {{top : 290}}>
                <FlatList 
                      data = {this.state.data}
                      keyExtractor = {(item) => item.ID}
                      renderItem = {({ item ,index}) => { if(item.ID == 0){
                        latitudeData = item.enlem;
                        longtitudeData = item.boylam;
                      }
                        return  <Pressable
                                  onPress={() => this.functionComplied(true,item.Konum,item.Tarih,item.Derinlik,item.Buyukluk,item.Enlem,item.Boylam) }>   
                                    <View style = {styles.flatListView}>
                                      <View style = {{margin : 10, marginTop : 20}}>
                                          <Text key={index} style = {{fontWeight : 'bold' , fontSize : 15 , marginBottom : 2}}>{item.Konum}</Text>
                                          <Text style = {{color : '#666666' , fontSize : 12 , marginBottom : 5}}>{item.Tarih}</Text>
                                          <Text style = {{color : '#FF4848' , fontSize : 12 , marginBottom : 2}}>Derinlik : {item.Derinlik} km</Text>
                                      </View>{
                                              this.rgbCode(item.Buyukluk)
                                              }
                                      <View style = {[styles.daireView , {backgroundColor : color}]}>
                                          <Text key={index} style = {{color :'white', fontSize : 17 , fontWeight : 'bold'}}>{item.Buyukluk}</Text>
                                      </View>
                                    </View>
                                </Pressable>
                      }}
                      
                    />
              </View>
            </View>
        </View>
      );
    }
  }

  
  const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#267871'
    },
    text : {
        fontSize : 20,
        fontWeight : 'bold',
        color : '#fff'
    },
    topBar : {
        top : 0,
        height : 40,
        backgroundColor : '#ffffff',
        alignItems : 'center',
        justifyContent : 'center',
        shadowColor : '#000000',
      shadowOffset : {
        width : 100,
        height : 100,
      },
      shadowOpacity : 1,
      shadowRadius : 3,
      elevation : 20
    },
    topBarText : {
      color : '#000000',
      fontSize : 17,
      fontWeight : '600'
    },
    mapViewStyle : {
      position : 'absolute',
      left : 0,
      right : 0,
      top : 0,

    },
    flatListView : {
      height : 95,
      flexDirection : 'row' , 
      justifyContent : 'space-between' , 
      marginTop : 0 , 
      backgroundColor : 'white' ,
      marginBottom : 10 ,
      marginLeft : 20,
      marginRight : 20,
      borderRadius : 20,
      shadowColor : '#000000',
        shadowOffset : {
          width : 0,
          height : 20,
        },
        shadowOpacity : 0.7,
        shadowRadius : 3,
        elevation : 15
    },
    daireView : {
      top : 20,
      marginRight : 10,
      alignItems : 'center', 
      justifyContent : 'center',
      width : 55, 
      height : 55, 
      borderRadius : 50
    },
    centeredTwoView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalTwoView: {
      margin: 20,
      backgroundColor: "#e9e9e9",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      height : 790,
      width : 380,
      flexDirection : 'column'
    },
    informationView : {
      position : 'absolute',
      top : 480,
      backgroundColor : 'white',
      flexDirection : 'row' , 
      justifyContent : 'space-between' , 
      width : 350,
      height : 230,
      borderRadius : 25,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.9,
      shadowRadius: 4,
      elevation: 5,
    },
  });
  

  