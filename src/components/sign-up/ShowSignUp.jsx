import { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import FirebaseContext from '../../contexts/Firebase';
import * as ROUTES from '../../constants/Routes';
import { doesEmailAddressExist, doesUsernameExist } from '../../services/Firebase';
import { useMediaQuery } from 'react-responsive';

export default function ShowSignUp() {
    const history = useHistory();
    const { firebase } = useContext(FirebaseContext);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const isInvalid = password === '' || emailAddress === '';
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const handleSignUp = async (e) => {
        e.preventDefault();
        const usernameExists = await doesUsernameExist(username);
        const emailAddressExists = await doesEmailAddressExist(emailAddress);
        if (!usernameExists.length && !emailAddressExists.length) {
            try {
                const createdUserResult = await firebase.auth().createUserWithEmailAndPassword(emailAddress, password);
                await createdUserResult.user.updateProfile({
                    displayName: username
                });
                const data = {
                    userId: createdUserResult.user.uid,
                    username: username.toLowerCase(),
                    fullName,
                    emailAddress: emailAddress.toLowerCase(),
                    favoritePosts: [],
                    ownComments: [],
                    dateCreated: Date.now()
                }
                await firebase.firestore().collection('users').doc(data.userId).set(data);
                return history.push(ROUTES.PROFILE);
            } catch (error) {
                setUsername('');
                setFullName('');
                setEmailAddress('');
                setPassword('');
                setError('A regisztr??ci?? sor??n hiba t??rt??nt! K??rj??k, pr??b??lja ??jra!');
                setTimeout(() => {
                    setError("");
                }, 5000);
            }
        } else {
            setUsername('');
            setFullName('');
            setEmailAddress('');
            setPassword('');
            setError('M??r regisztr??ltak ezzel a felhaszn??l??n??vvel ??s/vagy e-mail c??mmel!');
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };
    const useStyles = makeStyles((theme) => ({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
    }));
    const classes = useStyles();

    return (
        <>
            <div>
                <h2>Regisztr??ci??</h2>
            </div>
            <form data-testid="sign-up" className={classes.root} noValidate autoComplete="off" onSubmit={handleSignUp} method="POST">
                <Grid container
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                    {error && (
                        <div data-testid="error" className="text-danger">
                            {error}
                        </div>
                    )}
                    <TextField
                        size={isTabletOrMobile ? "small" : "medium"}
                        style={{ maxWidth: 300 }}
                        className="TextField"
                        required
                        inputProps={{ "data-testid": "input-username" }}
                        id="username-filled-required"
                        label="Felhaszn??l??n??v"
                        variant="filled"
                        onChange={({ target }) => setUsername(target.value)}
                        value={username}
                    />
                    <TextField
                        size={isTabletOrMobile ? "small" : "medium"}
                        style={{ maxWidth: 300 }}
                        className="TextField"
                        required
                        inputProps={{ "data-testid": "input-fullname" }}
                        id="fullname-filled-required"
                        label="Teljes n??v"
                        variant="filled"
                        onChange={({ target }) => setFullName(target.value)}
                        value={fullName}
                    />
                    <TextField
                        size={isTabletOrMobile ? "small" : "medium"}
                        style={{ maxWidth: 300 }}
                        className="TextField"
                        required
                        inputProps={{ "data-testid": "input-email" }}
                        id="email-filled-required"
                        label="E-mail c??m"
                        variant="filled"
                        onChange={({ target }) => setEmailAddress(target.value)}
                        value={emailAddress}
                    />
                    <TextField
                        size={isTabletOrMobile ? "small" : "medium"}
                        style={{ maxWidth: 300 }}
                        className="TextField"
                        required
                        inputProps={{ "data-testid": "input-password" }}
                        id="password-filled-required"
                        label="Jelsz??"
                        variant="filled"
                        type="password"
                        onChange={({ target }) => setPassword(target.value)}
                        value={password}
                    />
                </Grid>
                <Grid container
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                    <Button size={isTabletOrMobile ? "small" : "medium"} type="submit" variant="contained" color="primary" disabled={isInvalid} style={{ marginRight: "10px" }}>
                        Regisztr??ci??
                    </Button>
                    <Button size={isTabletOrMobile ? "small" : "medium"} data-testid="return" variant="contained" color="secondary" onClick={() => {
                        history.push(ROUTES.HOME);
                    }}>
                        Vissza
                    </Button>
                </Grid>
            </form>
            <div className="m-2">
                <p>
                    Van fi??kja?{` `}
                    <Link to={ROUTES.LOGIN} data-testid="login">
                        Jelentkezzen be!
                    </Link>
                </p>
            </div>
        </>
    )
}