import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import {
    View,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Text,
    ScrollView
} from 'react-native';
import {
    Card,
    Loading
} from '../../components';
import ActionButton from 'react-native-action-button';
import {
    getOwners as getOwnerByCnhId
} from '../../actions/ownerVehicles';
import {
    cnhSelector,
    ownerSelector
} from '../../reducers/selectors';
const {
    width
} = Dimensions.get('window');

class MyListOwner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        this.props.dispatch(
            getOwnerByCnhId(this.props.cnh.id)
        )
            .then(() => this.setState({ loading: false }))
            .catch(() => this.setState({ loading: false }))
    }

    renderList = () => {
        return (
            <FlatList
                data={this.props.owners}
                renderItem={this.renderItems}
                keyExtractor={(item) => item.cpf_cnpj}
            />
        );
    }

    renderItems = ({ item }, index) => {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('myRegisterOwnerStack', { id: item.id })}
                key={index}
            >
                <Card containerStyle={styles.card}>
                    <View
                        style={styles.containerTitle}
                    >
                        <Text style={styles.textTitle}>
                            {item.nome}
                        </Text>
                    </View>
                    <View style={styles.containerBody}>
                        <Text style={styles.text}>
                            <Text style={styles.label}>
                                CPF/CNPJ:{' '}
                            </Text>
                            <Text>
                                {item.cpf_cnpj}
                            </Text>
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.label}>
                                RG/IE:{' '}
                            </Text>
                            <Text>
                                {item.rg_ie}
                            </Text>
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.label}>
                                Tipo pessoa:{' '}
                            </Text>
                            <Text>
                                {(item.tipo_pessoa === 'F') ? 'Fisíca' : 'Jurídica'}
                            </Text>
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.label}>
                                Tipo transportador:{' '}
                            </Text>
                            <Text>
                                {item.tipo_transp}
                            </Text>
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.label}>
                                E-mail:{' '}
                            </Text>
                            <Text>
                                {item.email}
                            </Text>
                        </Text>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    }

    renderFab = () => {
        return (
            <ActionButton
                buttonColor="#283484"
                onPress={() => this.props.navigation.navigate('menuTravel')}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Loading show={this.state.loading} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderList()}
                </ScrollView>
                {this.renderFab()}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        cnh: cnhSelector(state),
        owners: ownerSelector(state)
    }
}

export default connect(mapStateToProps)(MyListOwner);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: global.COLOR_BACKGROUND
    },
    card: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: 'white',
        elevation: 2,
        borderTopWidth: 0,
        width: (width / 1.1),
        borderRadius: 20
    },
    containerTitle: {
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        width: (width / 1.1),
        backgroundColor: global.COLOR_LIGHT,
        height: 40,
        paddingHorizontal: 20,
        justifyContent: 'center'
    },
    containerBody: {
        paddingHorizontal: 10,
        paddingVertical: 20
    },
    textTitle: {
        textAlign: 'center',
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold'
    },
    label: {
        fontWeight: 'bold'
    },
    text: {
        margin: 2,
        fontSize: 15
    }
});