import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import {authorsFormattedForDropdown} from '../../selectors/selectors';
import SelectInput from '../common/SelectInput';
import CourseList from './CourseList';
import {Link} from 'react-router';
import toastr from 'toastr';

class CourseListRow extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      course: Object.assign({}, props.course),
      deleting: false,
      edit: false
    };

    this.deleteCourse = this.deleteCourse.bind(this);
    this.editCourse = this.editCourse.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
    this.cancelSaveCourse = this.cancelSaveCourse.bind(this);
  }

  deleteCourse(event, course) {
    event.preventDefault();

    this.setState({deleting: true});

    this.props.actions.deleteCourse(course)
      .then(result => {})
      .catch(error => {
        toastr.error(error);
        this.setState({deleting: false});
    });
  }

  editCourse(event, course) {
    event.preventDefault();

    this.setState({edit: true});
  }

  saveCourse(event, course) {
    event.preventDefault();

    this.setState({edit: false});

    this.props.actions.saveCourse(course)
      .then(result => {})
      .catch(error => {
        toastr.error(error);
        this.setState({edit: false});
    });
  }
  
  updateCourseState(event) {
    const field = event.target.name;
    let course = Object.assign({}, this.state.course);
    course[field] = event.target.value;
    return this.setState({course: course});
  }

  cancelSaveCourse(event, course) {
    event.preventDefault();    
    this.setState({edit: false});
  }

  render() {
    return (
      <tr>
        <td><a href={this.state.course.watchHref} target="_blank">Watch</a></td>
        <td>
            { this.state.edit ? 
              <input
                type="text"
                name="title"
                className="form-control"
                value={this.state.course.title}
                onChange={(event) => { this.updateCourseState(event); }} /> : <Link to={'/course/' + this.state.course.id}>{this.state.course.title}</Link> 
            }            
        </td>
        <td>
            { this.state.edit ? 
              <SelectInput
                name="authorId"
                value={this.state.course.authorId}
                defaultOption="Select Author"
                options={this.props.allAuthors}
                onChange={(event) => { this.updateCourseState(event); }} /> : this.state.course.authorId
            }
        </td>
        <td className="category">
            { this.state.edit ? 
              <input
                type="text"
                name="category"
                className="form-control"
                value={this.state.course.category}
                onChange={(event) => { this.updateCourseState(event); }} /> : this.state.course.category
            }
        </td>
        <td className="table-length">
          { this.state.edit ? 
              <input
                type="text"
                name="length"
                className="form-control"
                value={this.state.course.length}
                onChange={(event) => { this.updateCourseState(event); }} /> : this.state.course.length
            }
        </td>
        <td>
          { this.state.edit ? 
              <input
                type="submit"
                value="Save"
                className="btn btn-primary"
                onClick={(event) => { this.saveCourse(event, this.state.course) }}
                style={{marginRight: '5px'}} /> :
              <input
                type="submit"
                disabled={this.state.course.deleting}
                value="Edit"
                className="btn btn-primary"
                onClick={(event) => { this.editCourse(event, this.state.course) }}
                style={{marginRight: '5px'}} /> 
           }
           { this.state.edit ? 
              <input
                type="submit"
                value="Cancel"
                className="btn btn-primary"
                onClick={(event) => { this.cancelSaveCourse(event, this.state.course) }}
                style={{marginRight: '5px'}} /> :
              <input
                type="submit"
                disabled={this.state.course.deleting}
                value={this.state.deleting ? 'Deleting...' : 'Delete'}
                className="btn btn-primary"
                onClick={(event) => { this.deleteCourse(event, this.state.course) }} />
           }
        </td>
      </tr>
    );
  }
};

CourseListRow.propTypes = {
  course: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,  
  allAuthors: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    allAuthors: authorsFormattedForDropdown(state.authors)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseListRow);