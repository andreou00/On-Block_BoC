import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

// BoC API OAuth2 Token Endpoint and Authorization URLs
const BOC_AUTH_URL = 'https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/psd2/oauth2/authorize';
const BOC_OAUTH_URL = 'https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/psd2/oauth2/token';
const BOC_API_BASE_URL = 'https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/psd2/v1';

const CLIENT_ID = 'df5521312390e1614164ad6a9ae75fef';
const CLIENT_SECRET = '118bea450bf465529f23ed0873c9595c';
const SUBSCRIPTION_ID = 'Subid000001-1729339666833';
const REDIRECT_URI = 'http://localhost:3000/';

function BoCLoginAndFetch() {
    const [userName, setUserName] = useState('');
    const [accountData, setAccountData] = useState([]); // Store multiple accounts
    const [selectedAccount, setSelectedAccount] = useState(null); // Store selected account
    const [authToken, setAuthToken] = useState(null);
    const [oauthCode, setOauthCode] = useState(null); // To store oauthCode
    const [accountDetails, setAccountDetails] = useState(null); // To store detailed account information
    const [searchParams] = useSearchParams();
    const authCode = searchParams.get('code');

    // Step 1: Get oauthCode using Client Credentials Flow
    const fetchClientToken = async () => {
        try {
            const response = await axios.post(
                BOC_OAUTH_URL,
                new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    scope: 'TPPOAuth2Security'
                }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }
            );
            setOauthCode(response.data.access_token); // Store oauthCode
        } catch (error) {
            console.error('Error fetching OAuth token:', error);
        }
    };

    // Redirect the user to BoC authorization page
    const loginWithBoC = () => {
        const authUrl = `${BOC_AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=UserOAuth2Security&subscriptionid=${SUBSCRIPTION_ID}`;
        window.location.href = authUrl;
    };

    // Function to exchange the authorization code for an access token
    const fetchAccessToken = async (code) => {
        try {
            const response = await axios.post(
                BOC_OAUTH_URL,
                new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: REDIRECT_URI,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    scope: 'UserOAuth2Security'
                }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }
            );
            return response.data.access_token; // Return token
        } catch (error) {
            console.error('Error fetching access token:', error);
            return null;
        }
    };

    // Fetch the user's account data from BoC API
    const fetchAccountData = async (token) => {
        const journeyId = generateGuid(); // Generate unique journeyId
        const timeStamp = Math.floor(Date.now() / 1000).toString(); // Generate UNIX timestamp

        try {
            const response = await axios.get(`${BOC_API_BASE_URL}/accounts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    subscriptionId: SUBSCRIPTION_ID,
                    journeyId: journeyId, // Unique ID for the transaction
                    timeStamp: timeStamp, // UNIX timestamp
                },
            });

            if (response.data.accounts && response.data.accounts.length > 0) {
                setAccountData(response.data.accounts); // Store all accounts
                setUserName(response.data.accounts[0].accountName); // Set user name
            } else {
                console.error('No account data found.');
            }
        } catch (error) {
            console.error('Error fetching account data:', error);
        }
    };

    // Fetch detailed information for the selected account
    const fetchAccountDetails = async (accountId) => {
        const journeyId = generateGuid();
        const timeStamp = Math.floor(Date.now() / 1000).toString();

        try {
            const response = await axios.get(`${BOC_API_BASE_URL}/accounts/${accountId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    subscriptionId: SUBSCRIPTION_ID,
                    journeyId: journeyId,
                    timeStamp: timeStamp,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    'Content-Type': 'application/json',
                    'correlationId': generateGuid(),
                    'lang': 'en',
                    'onlineAccessFlag': 'true',
                    'originChannelId': 'WEB',
                    'originDeptId': 'IT',
                    'originEmployeeId': '123456',
                    'originSourceId': '123456',
                    'originTerminalId': '123456',
                    'originUserId': 'userid123',
                    'tppid': 'singpaymentdata',
                }
            });

            setAccountDetails(response.data); // Store the account details
        } catch (error) {
            console.error('Error fetching account details:', error);
        }
    };

    // Function to generate a unique GUID for journeyId
    const generateGuid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    // Automatically exchange authorization code for access token on mount
    useEffect(() => {
        const initialize = async () => {
            if (!oauthCode) {
                await fetchClientToken(); // Fetch oauthCode first
            }
            if (authCode) {
                const token = await fetchAccessToken(authCode);
                if (token) {
                    setAuthToken(token); // Store token
                    await fetchAccountData(token);
                }
            }
        };
        initialize();
    }, [authCode, oauthCode]);

    return (
        <div>
            <h2>Login to Bank of Cyprus</h2>
            {authToken ? (
                <div>
                    <h3>Welcome, {userName}</h3>
                    <p>Select an account to fetch details:</p>
                    <select onChange={(e) => setSelectedAccount(e.target.value)}>
                        <option value="">Select Account</option>
                        {accountData.map((account) => (
                            <option key={account.accountId} value={account.accountId}>
                                {account.accountName} ({account.IBAN})
                            </option>
                        ))}
                    </select>
                    {selectedAccount && (
                        <button onClick={() => fetchAccountDetails(selectedAccount)}>
                            Fetch Account Details
                        </button>
                    )}
                    {accountDetails && (
                        <div>
                            <h4>Selected Account Details:</h4>
                            <pre>{JSON.stringify(accountDetails, null, 2)}</pre>
                        </div>
                    )}
                </div>
            ) : (
                <button onClick={loginWithBoC}>Login with BoC</button>
            )}
        </div>
    );
}

export default BoCLoginAndFetch;
