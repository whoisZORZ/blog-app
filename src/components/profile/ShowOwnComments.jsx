import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid } from "@material-ui/core";
import { Button } from '@material-ui/core';
import slugify from 'react-slugify';

export default function ShowOwnComments({ user }) {
    const history = useHistory();

    return (
        <Grid container
            direction="column"
            justifyContent="center"
            alignItems="center">
            <h5>{user?.ownComments.length === 0 ? "Jelenleg nincsenek saját hozzászólásai!" : "Saját hozzászólások"}</h5>
            {user?.ownComments?.map((comment, i) => (
                <div key={i}>
                    <Button size="small" data-testid="user-comment-button" variant="text" color="primary" onClick={() => {
                        history.push(`/posts/${slugify(comment?.title)}`)
                    }}>
                        <h6>{comment?.title}</h6>
                    </Button>
                    <p>{comment?.comment}</p>
                </div>
            ))}
        </Grid>
    )
}

ShowOwnComments.propTypes = {
    user: PropTypes.object
};