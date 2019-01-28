import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ReactStars from 'react-stars';

import Tabs from '../../common/Tab/Index';
import EmptyContent from '../../common/EmptyContent';


export class RatingsTabs extends Component {
  render() {
    const userRatings = this.props.ratings;

    return (
      <div>
      {
        userRatings.length > 0
        ? (<Tabs>
          { userRatings[0].result.map((mealObject, key) => (
            <div key={key} label={mealObject.mainMeal}>
              <div className="rating-container" label="Rice">
              <h1 className="rating-sub-title">Main Meal Rated: {mealObject.mainMeal}</h1>
              <h1 className="vendor-name rating-sub-title">Vendor: {userRatings[0].vendor}</h1>
              <hr className="line-style" />
              <span><br />Overall Rating:</span>
              <ReactStars
                value={mealObject.overallRating}
                color2= {mealObject.overallRating <= 3 ? "orange" : "green"}
                name="ratings"
                size={12}
                edit={false}
                />
              <br /><br /><br />
              <span><strong>Comments</strong></span><br/><br/>
              {
                mealObject.items.map((itemObject, key) => (
                  <div key={key} className="comments-row">
                    <span>{itemObject.comment}</span>
                    <ReactStars
                    value={itemObject.rating}
                    color2={itemObject.rating <= 3 ? "orange" : "green"}
                    name="ratings"
                    size={12}
                    edit={false}
                    />
                </div>
              ))}
              </div>
            </div>
          ))}
        </Tabs>)
        : <EmptyContent message = 'No Ratings for this day' />
      }
      </div>
    );
  }
}

const mapStateToProps = ({ allRatings }) => ({
  ratings: allRatings.ratingList
});

export default connect(mapStateToProps)(RatingsTabs);
