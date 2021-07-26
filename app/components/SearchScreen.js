import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Modal,
    TouchableOpacity,
    Pressable,FlatList,
    Image
} from 'react-native';
import  SQLite  from 'react-native-sqlite-storage';
import { color } from 'react-native-reanimated';
import MapView, {Marker,PROVIDER_GOOGLE} from 'react-native-maps';

const options = [{
  number : 1,
  option : '+1 Depremler'
},
{
  number : 3,
  option : '+3 Depremler'
},
{
  number : 4,
  option : '+4 Depremler'
},
{
  number : 5,
  option : '+5 Depremler'
},
{
  number : 6,
  option : '+6 Depremler'
},
]

const db = SQLite.openDatabase(
  {
    name :'EarthQuakeDataBase',
    location:'default',
  }, () => {
    console.log('Database açma başarılı')

  }, (err) => {
    console.log('Database açma başarısız')
  });

var bgcolor;



export default class SearchScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data : [],
      visibility : false,
      choose : 'Büyüklük Seçin...',
      isModalVisible : false ,
      number : null,
      konum : "",
      saat : "",
      derinlik : null,
      buyukluk : null,
      enlem : 0,
      boylam : 0,
    }
  }
  readRecord = (value) => {
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM data WHERE Buyukluk >= ?',[value],(tx,result) =>{
          
            var dbDatalength = result.rows.length;
            if(dbDatalength >= 0){
              let helperArray = [];
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
  
  changeModalVisibility = (visible,select,value) => {
    this.setState({
      isModalVisible : visible,
      choose : select,
      number : value,
    });
  } 

  rgbCode(deger){
    if(deger>=2 && deger<3){
      bgcolor = '#c6c916'
    }
    if(deger<2){
      bgcolor = '#00A611';
    }
    if(deger>=3 && deger<5){
      bgcolor = '#FA8E00'
    }  
    if(deger>5){
      bgcolor = '#CF0015'
    }
    }

    flatList(){
      if(this.state.number != null){
        this.readRecord(this.state.number)
      }
    }

    changeModalVisible = (visible) => {
      this.setState({
        visibility : visible,
      });
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


  render(){
    const { isModalVisible , choose ,number} = this.state;
    const {visibility,konum,saat,derinlik,buyukluk,enlem,boylam} = this.state;
    return (
      <View style = {styles.container}>
        <View style = {styles.container}>
        <View style= {styles.topBar}>
          <Text style = {styles.topBarText}>Arama</Text>
        </View>
        <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose = {() => {this.changeModalVisibility(!isModalVisible,choose);}}
          >
            <View style = {styles.centeredView}>
              <View style = {styles.modalView}>
                {
                  options.map((item,index) => (
                    <Pressable 
                    style = {[styles.button , styles.buttonClose]}
                    onPress = {() => this.changeModalVisibility(!isModalVisible,item.option,item.number)}
                    > 
                      <Text style={styles.textStyle}>{item.option}</Text>
                    </Pressable>
                  ))
                }
              </View>
            </View>
          </Modal>
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
          
                          <Marker coordinate={{ latitude :  enlem, longitude : boylam }} />
                    
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
                        <View style = {{width : 90 ,backgroundColor : bgcolor , height : '100%' , borderTopRightRadius : 25 , alignItems : 'center' , justifyContent : 'center'}}>
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
        <View style = {styles.filter}> 
          <Pressable
            style = {[styles.button , styles.buttonOpen , {margin : 5 , marginBottom : 10}]}
            onPress = {() => this.changeModalVisibility(true,choose,number)}
          >
            <Text style={[styles.textStyle , {color : '#000000'} ]}>{choose}</Text>
          </Pressable>
        </View>
        {
          this.flatList()
        }
        <View style = {{top : 10}}>
                <FlatList 
                      data = {this.state.data}
                      keyExtractor = {(item) => item.ID}
                      renderItem = {({ item ,index}) => {
                        return <Pressable
                        onPress={() => this.functionComplied(true,item.Konum,item.Tarih,item.Derinlik,item.Buyukluk,item.Enlem,item.Boylam) }>   
                          <View style = {styles.flatListView}>
                            <View style = {{margin : 10, marginTop : 20}}>
                                <Text key={index} style = {{fontWeight : 'bold' , fontSize : 15 , marginBottom : 2}}>{item.Konum}</Text>
                                <Text style = {{color : '#666666' , fontSize : 12 , marginBottom : 5}}>{item.Tarih}</Text>
                                <Text style = {{color : '#FF4848' , fontSize : 12 , marginBottom : 2}}>Derinlik : {item.Derinlik} km</Text>
                            </View>{
                                    this.rgbCode(item.Buyukluk)
                                    }
                            <View style = {[styles.daireView , {backgroundColor  : bgcolor}]}>
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
  };
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
      justifyContent : 'center'
  },
  topBarText : {
    color : '#000000',
    fontSize : 17,
    fontWeight : '600'
  },
  filter : {
      height : 55,
      backgroundColor : '#95B9C7', 
  },
  touchableOpacity : {
    backgroundColor : 'white',
    height : 40,
    borderRadius : 20,
    alignItems : 'center',
    justifyContent : 'center',
    margin : 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent : 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height : 500
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 5,
    marginBottom : 20,
  },
  buttonOpen: {
    backgroundColor: "white",
  },
  buttonClose: {
    width : 250,
    marginBottom : 30,
    backgroundColor: "#119B9F",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize : 16
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
  mapViewStyle : {
    position : 'absolute',
    left : 0,
    right : 0,
    top : 0,

  },
  });
  