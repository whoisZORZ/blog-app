import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Login from '../../pages/Login';
import FirebaseContext from '../../contexts/Firebase';
import * as ROUTES from '../../constants/Routes';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

jest.mock('../../services/firebase');

describe('<Login />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Megjelenik a bejelentkezéshez szükséges form, sikeresen bejelentkezik a felhasználó', async () => {
        const succeededToLogin = jest.fn(() => Promise.resolve('Sikeres bejelentkezés!'));
        const firebase = {
            auth: jest.fn(() => ({
                signInWithEmailAndPassword: succeededToLogin
            }))
        };
        const { getByTestId, queryByTestId } = render(
                <Router>
                    <FirebaseContext.Provider value={{ firebase }}>
                        <Login />
                    </FirebaseContext.Provider>
                </Router>
        );

        await act(async () => {
            await fireEvent.change(getByTestId('input-email'), {
                target: { value: 'orszaghlev@gmail.com' }
            });
            await fireEvent.change(getByTestId('input-password'), { target: { value: 'test1234' } });
            fireEvent.submit(getByTestId('login'));

            expect(document.title).toEqual('Bejelentkezés');
            expect(succeededToLogin).toHaveBeenCalled();
            expect(succeededToLogin).toHaveBeenCalledWith('orszaghlev@gmail.com', 'test1234');

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.HOME);
                expect(getByTestId('input-email').value).toBe('orszaghlev@gmail.com');
                expect(getByTestId('input-password').value).toBe('test1234');
                expect(queryByTestId('error')).toBeFalsy();
            });
        });
    });

    it('Megjelenik a bejelentkezéshez szükséges form, de a felhasználó bejelentkezése sikertelen', async () => {
        const failToLogin = jest.fn(() => Promise.reject(new Error('Sikertelen bejelentkezés, nem megfelelő e-mail és/vagy jelszó!')));
        const firebase = {
            auth: jest.fn(() => ({
                signInWithEmailAndPassword: failToLogin
            }))
        };
        const { getByTestId, queryByTestId } = render(
                <Router>
                    <FirebaseContext.Provider value={{ firebase }}>
                        <Login />
                    </FirebaseContext.Provider>
                </Router>
        );

        await act(async () => {
            await fireEvent.change(getByTestId('input-email'), {
                target: { value: 'orszaghlev.com' }
            });
            await fireEvent.change(getByTestId('input-password'), { target: { value: 'test1234' } });
            fireEvent.submit(getByTestId('login'));

            expect(document.title).toEqual('Bejelentkezés');
            expect(failToLogin).toHaveBeenCalled();
            expect(failToLogin).toHaveBeenCalledWith('orszaghlev.com', 'test1234');
            expect(failToLogin).rejects.toThrow('Sikertelen bejelentkezés, nem megfelelő e-mail és/vagy jelszó!');

            //expect(failToLogin).rejects.toThrow('Sikertelen bejelentkezés, nem megfelelő e-mail és/vagy jelszó!');

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
                expect(getByTestId('input-email').value).toBe('');
                expect(getByTestId('input-password').value).toBe('');
                expect(queryByTestId('error')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a bejelentkezéshez szükséges form, de a felhasználó visszalép a kezdőoldalra', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            }))
        };
        const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider value={{ firebase }}>
                        <Login />
                    </FirebaseContext.Provider>
                </Router>
        );

        await act(async () => {
            fireEvent.click(getByTestId('return'));

            expect(document.title).toEqual('Bejelentkezés');

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.HOME);
            });
        });
    });
});