import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  min-height: calc(100vh - 70px);
  background: #f8fafc;
  padding: 2rem 0;
`;

const ProfileContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ProfileHeader = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 600;
  margin: 0 auto 1rem;
`;

const UserName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
  margin-bottom: 1rem;
`;

const UserRole = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
`;

const ProfileTabs = styled.div`
  display: flex;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 1rem;
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    background: #3b82f6;
    color: white;
  }

  &:hover:not(.active) {
    background: #f3f4f6;
  }
`;

const TabContent = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &.error {
    border-color: #ef4444;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.secondary {
    background: #6b7280;

    &:hover {
      background: #4b5563;
    }
  }

  &.danger {
    background: #ef4444;

    &:hover {
      background: #dc2626;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const SubscriptionCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
`;

const SubscriptionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const SubscriptionDescription = styled.p`
  opacity: 0.9;
  margin-bottom: 1.5rem;
`;

const SubscriptionActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const DangerZone = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const DangerTitle = styled.h3`
  color: #dc2626;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const DangerDescription = styled.p`
  color: #991b1b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const Profile = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    preferences: {
      units: user?.preferences?.units || 'metric',
      theme: user?.preferences?.theme || 'light'
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) return;

    setIsLoading(true);
    try {
      await updateProfile(profileData);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password change error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement account deletion
      console.log('Delete account');
    }
  };

  const renderProfileTab = () => (
    <TabContent>
      <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '600' }}>
        Profile Information
      </h2>
      
      <Form onSubmit={handleProfileSubmit}>
        <FormGroup>
          <Label htmlFor="name">Full Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            className={errors.name ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            value={user?.email || ''}
            disabled
            style={{ background: '#f9fafb', color: '#6b7280' }}
          />
          <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>
            Email cannot be changed. Contact support if needed.
          </small>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="preferences.units">Preferred Units</Label>
          <Select
            id="preferences.units"
            name="preferences.units"
            value={profileData.preferences.units}
            onChange={handleProfileChange}
            disabled={isLoading}
          >
            <option value="metric">Metric (meters, cm)</option>
            <option value="imperial">Imperial (feet, inches)</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="preferences.theme">Theme Preference</Label>
          <Select
            id="preferences.theme"
            name="preferences.theme"
            value={profileData.preferences.theme}
            onChange={handleProfileChange}
            disabled={isLoading}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </Select>
        </FormGroup>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form>
    </TabContent>
  );

  const renderPasswordTab = () => (
    <TabContent>
      <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '600' }}>
        Change Password
      </h2>
      
      <Form onSubmit={handlePasswordSubmit}>
        <FormGroup>
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className={errors.currentPassword ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.currentPassword && <ErrorMessage>{errors.currentPassword}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            type="password"
            id="newPassword"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className={errors.newPassword ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.newPassword && <ErrorMessage>{errors.newPassword}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className={errors.confirmPassword ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
        </FormGroup>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Changing...' : 'Change Password'}
        </Button>
      </Form>
    </TabContent>
  );

  const renderSubscriptionTab = () => (
    <TabContent>
      <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '600' }}>
        Subscription & Billing
      </h2>
      
      <SubscriptionCard>
        <SubscriptionTitle>
          {user?.subscription?.type?.charAt(0).toUpperCase() + user?.subscription?.type?.slice(1)} Plan
        </SubscriptionTitle>
        <SubscriptionDescription>
          {user?.subscription?.type === 'free' 
            ? 'You\'re currently on our free plan. Upgrade to unlock premium features.'
            : 'You\'re enjoying all premium features. Thank you for your subscription!'
          }
        </SubscriptionDescription>
        <SubscriptionActions>
          {user?.subscription?.type === 'free' ? (
            <Button as="a" href="/pricing">
              Upgrade Plan
            </Button>
          ) : (
            <>
              <Button as="a" href="/billing">
                Manage Billing
              </Button>
              <Button className="secondary" as="a" href="/pricing">
                Change Plan
              </Button>
            </>
          )}
        </SubscriptionActions>
      </SubscriptionCard>

      <StatsGrid>
        <StatCard>
          <StatNumber>0</StatNumber>
          <StatLabel>Floorplans Created</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>0</StatNumber>
          <StatLabel>Downloads</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>0</StatCard>
          <StatLabel>Collaborations</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>0</StatNumber>
          <StatLabel>AI Suggestions Used</StatLabel>
        </StatCard>
      </StatsGrid>
    </TabContent>
  );

  const renderAccountTab = () => (
    <TabContent>
      <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '600' }}>
        Account Settings
      </h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
          Account Information
        </h3>
        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
          <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
            <strong>Account ID:</strong> {user?.id}
          </p>
          <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
            <strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
          </p>
          <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
            <strong>Last login:</strong> {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Unknown'}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
          Data & Privacy
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Button className="secondary" as="a" href="/export-data">
            📥 Export My Data
          </Button>
          <Button className="secondary" as="a" href="/privacy-settings">
            🔒 Privacy Settings
          </Button>
        </div>
      </div>

      <DangerZone>
        <DangerTitle>Danger Zone</DangerTitle>
        <DangerDescription>
          These actions are permanent and cannot be undone. Please proceed with caution.
        </DangerDescription>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button className="danger" onClick={handleLogout}>
            🚪 Sign Out
          </Button>
          <Button className="danger" onClick={handleDeleteAccount}>
            🗑️ Delete Account
          </Button>
        </div>
      </DangerZone>
    </TabContent>
  );

  return (
    <ProfileContainer>
      <ProfileContent>
        <ProfileHeader>
          <Avatar>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <UserName>{user?.name || 'User'}</UserName>
          <UserEmail>{user?.email}</UserEmail>
          <UserRole>{user?.role || 'user'}</UserRole>
        </ProfileHeader>

        <ProfileTabs>
          <TabButton
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </TabButton>
          <TabButton
            className={activeTab === 'password' ? 'active' : ''}
            onClick={() => setActiveTab('password')}
          >
            Password
          </TabButton>
          <TabButton
            className={activeTab === 'subscription' ? 'active' : ''}
            onClick={() => setActiveTab('subscription')}
          >
            Subscription
          </TabButton>
          <TabButton
            className={activeTab === 'account' ? 'active' : ''}
            onClick={() => setActiveTab('account')}
          >
            Account
          </TabButton>
        </ProfileTabs>

        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'password' && renderPasswordTab()}
        {activeTab === 'subscription' && renderSubscriptionTab()}
        {activeTab === 'account' && renderAccountTab()}
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;
