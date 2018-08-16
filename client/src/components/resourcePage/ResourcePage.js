import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ResourceList from './ResourceList';
import {fetchResources, deleteResource} from '../../actions/resourceActions';

class ResourcePage extends Component {
    componentDidMount() {
        this.props.fetchResources();
    }

    render() {
        return (
            <div>
                <div className="container mb-3">
                    <h1>Resource</h1>
                    <ResourceList resources={this.props.resources} deleteResource={this.props.deleteResource}/>
                </div>
            </div>
        );
    }
}

ResourcePage.propTypes = {
    resources: PropTypes.array.isRequired,
    fetchResources: PropTypes.func.isRequired,
    deleteResource:PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        resources: state.resources
    };
};

export default connect(mapStateToProps, {fetchResources, deleteResource})(ResourcePage);
