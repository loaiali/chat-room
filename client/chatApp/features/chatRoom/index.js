import React from 'react'
import { connect } from 'react-redux'
import {
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { GiftedChat, Actions, Bubble, SystemMessage } from 'react-native-gifted-chat';
import { doInit, sendMessage, sendSignedIn, loadOldMessages } from "./actions";
// import CustomActions from './customActions';
// import CustomView from './customView';


class ChatRoomScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // loadEarlier: true,
            typingText: null,
            // isLoadingEarlier: false,
        };

        this.currId = 0

        this._isMounted = false;
        this.onSend = this.onSend.bind(this);
        // this.renderCustomActions = this.renderCustomActions.bind(this);
        this.renderBubble = this.renderBubble.bind(this);
        this.renderSystemMessage = this.renderSystemMessage.bind(this);
        // this.renderFooter = this.renderFooter.bind(this);
        // this.onLoadEarlier = this.onLoadEarlier.bind(this);

        this._isAlright = null;
    }


    componentWillMount() {
        // TODO get it from the store state after auth
        this.props.doInit("ammar", this.props.roomId)
        this.props.sendSignedIn()
        this.props.loadOldMessages(this.props.roomId)
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onSend(messages = []) {
        let newMessage = messages[0]
        newMessage = {
            date: newMessage.createdAt,
            content: newMessage.text,
            owner: this.props.userId,
            time: "",
            room: this.props.roomId,
            token: this.props.token,
        }
        this.props.sendMessage(newMessage)
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        // backgroundColor: '#22AA22',

                    },
                    right: {
                        // backgroundColor: '#2222AA',
                    }

                }}
            />
        );
    }

    renderSystemMessage(props) {
        return (
            <SystemMessage
                {...props}
                containerStyle={{
                    marginBottom: 15,
                }}
                textStyle={{
                    fontSize: 14,
                }}
            />
        );
    }

    // renderCustomView(props) {
    //     return (
    //         <CustomView
    //             {...props}
    //         />
    //     );
    // }

    // renderFooter(props) {
    //     if (this.state.typingText) {
    //         return (
    //             <View style={styles.footerContainer}>
    //                 <Text style={styles.footerText}>
    //                     {this.state.typingText}
    //                 </Text>
    //             </View>
    //         );
    //     }
    //     return null;
    // }

    applyMessagesMapping() {
        if (!this.props.messages) {
            return []
        }
        return this.props.messages.map((mes) => ({
            _id: this.currId++,
            createdAt: mes.date,
            text: mes.content,
            user: {
                _id: mes.owner,
                name: mes.owner,
            },
        })).reverse()
    }

    render() {
        return (
            <GiftedChat
                messages={this.applyMessagesMapping()}
                onSend={this.onSend}
                // loadEarlier={this.state.loadEarlier}
                // onLoadEarlier={this.onLoadEarlier}
                // isLoadingEarlier={this.state.isLoadingEarlier}

                user={{
                    _id: this.props.userId, // sent messages should have same user._id
                }}

                // renderActions={this.renderCustomActions}
                renderBubble={this.renderBubble}
                renderSystemMessage={this.renderSystemMessage}
                // renderCustomView={this.renderCustomView}
                // renderFooter={this.renderFooter}
            />
        );
    }
}
const styles = StyleSheet.create({
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#aaa',
    },
});

const mapStateToProps = state => ({
    roomId: state.rooms.currRoomId,
    messages: state.chat.messages,
    roomName: state.chat.roomName,
    userId: state.auth.userId,
    token: state.auth.token,
})

const mapDispatchToProps = {
    doInit,
    sendMessage,
    sendSignedIn,
    loadOldMessages,
}
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ChatRoomScreen)