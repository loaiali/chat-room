import React from 'react'
import { connect } from 'react-redux'
import { View, Text } from "react-native"
import { List, Right, Button, ListItem, Item, Left, Input, Container, Header, Body, Title, Content } from 'native-base';
import { loadRooms, selectRoom } from './actions'

class RoomsListScreen extends React.Component {

    // fetch the codes before the screen show ups
    componentWillMount() {
        console.log("componentWillMount", "load rooms")
        this.props.loadRooms()
    }

    componentWillReceiveProps(nextProps) {
    }

    componentDidUpdate(prevProps) {
    }
    render() {
        console.log(this.props.rooms)
        return (
            // <View>
            //     <Text>ROOMS LIST</Text>
            // </View>
            <Container>
                <Header>
                    <Body>
                        <Title>Rooms list</Title>
                    </Body>
                </Header>
                <Content>
                    <List>
                        <ListItem itemHeader first>
                            <Item regular>
                                <Left>
                                    <Input placeholder='Regular Textbox' />
                                </Left>
                                <Right>
                                    <Button primary transparent><Text> Add </Text></Button>
                                </Right>
                            </Item>
                        </ListItem>
                        {this.props.rooms.map(room => (
                            <ListItem onPress={()=> this.onRoomClicked(room)} key={room._id}>
                                <Item>
                                    <Text>{room.roomName}</Text>
                                </Item>
                            </ListItem>
                        ))}
                    </List>
                </Content>
            </Container>
        )
    }
    onRoomClicked(room){
        this.props.selectRoom(room._id)
        this.props.navigation.navigate("chatRoom")
    }
}

const mapStateToProps = state => ({
    rooms: state.rooms.rooms,
    err: state.rooms.err,
    isLoading: state.rooms.loading,
})

const mapDispatchToProps = {
    loadRooms,
    selectRoom,
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomsListScreen)