import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const CollaborationContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
`;

const CollaborationHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
`;

const CollaborationTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
`;

const CollaborationSubtitle = styled.p`
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  opacity: 0.9;
`;

const CollaborationContent = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CollaboratorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CollaboratorItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const CollaboratorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CollaboratorAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
`;

const CollaboratorDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const CollaboratorName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const CollaboratorEmail = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const CollaboratorRole = styled.span`
  padding: 0.25rem 0.5rem;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
`;

const CollaboratorActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  &.danger {
    border-color: #ef4444;
    color: #ef4444;

    &:hover {
      background: #ef4444;
      color: white;
    }
  }
`;

const AddCollaboratorForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ActivityFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const ActivityIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.div`
  font-size: 0.875rem;
`;

const CollaborationPanel = ({ floorplanId }) => {
  const [collaborators, setCollaborators] = useState([]);
  const [activity, setActivity] = useState([]);
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState({
    email: '',
    role: 'viewer'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    // Simulate loading collaborators
    setCollaborators([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        avatar: 'J',
        joinedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'editor',
        avatar: 'J',
        joinedAt: new Date('2024-01-20')
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'viewer',
        avatar: 'B',
        joinedAt: new Date('2024-01-25')
      }
    ]);

    // Simulate loading activity
    setActivity([
      {
        id: '1',
        type: 'edit',
        user: 'John Doe',
        action: 'modified the living room layout',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        icon: '✏️'
      },
      {
        id: '2',
        type: 'add',
        user: 'Jane Smith',
        action: 'added furniture to the kitchen',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        icon: '➕'
      },
      {
        id: '3',
        type: 'comment',
        user: 'Bob Johnson',
        action: 'left a comment on the bedroom design',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        icon: '💬'
      }
    ]);
  }, [floorplanId]);

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    
    if (!newCollaborator.email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const collaborator = {
        id: Date.now().toString(),
        name: newCollaborator.email.split('@')[0],
        email: newCollaborator.email,
        role: newCollaborator.role,
        avatar: newCollaborator.email.charAt(0).toUpperCase(),
        joinedAt: new Date()
      };
      
      setCollaborators(prev => [...prev, collaborator]);
      setNewCollaborator({ email: '', role: 'viewer' });
      setIsAddingCollaborator(false);
      
      toast.success('Collaborator added successfully');
    } catch (error) {
      toast.error('Failed to add collaborator');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCollaborator = (collaboratorId) => {
    if (window.confirm('Are you sure you want to remove this collaborator?')) {
      setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
      toast.success('Collaborator removed');
    }
  };

  const handleChangeRole = (collaboratorId, newRole) => {
    setCollaborators(prev => 
      prev.map(c => 
        c.id === collaboratorId ? { ...c, role: newRole } : c
      )
    );
    toast.success('Role updated');
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <CollaborationContainer>
      <CollaborationHeader>
        <CollaborationTitle>👥 Collaboration</CollaborationTitle>
        <CollaborationSubtitle>Manage team access and track changes</CollaborationSubtitle>
      </CollaborationHeader>

      <CollaborationContent>
        <Section>
          <SectionTitle>
            <span>👥</span>
            Collaborators ({collaborators.length})
          </SectionTitle>
          
          <CollaboratorList>
            {collaborators.map((collaborator) => (
              <CollaboratorItem key={collaborator.id}>
                <CollaboratorInfo>
                  <CollaboratorAvatar>
                    {collaborator.avatar}
                  </CollaboratorAvatar>
                  <CollaboratorDetails>
                    <CollaboratorName>{collaborator.name}</CollaboratorName>
                    <CollaboratorEmail>{collaborator.email}</CollaboratorEmail>
                  </CollaboratorDetails>
                </CollaboratorInfo>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CollaboratorRole>{collaborator.role}</CollaboratorRole>
                  <CollaboratorActions>
                    <ActionButton
                      onClick={() => {
                        const newRole = collaborator.role === 'viewer' ? 'editor' : 
                                       collaborator.role === 'editor' ? 'admin' : 'viewer';
                        handleChangeRole(collaborator.id, newRole);
                      }}
                    >
                      {collaborator.role === 'viewer' ? 'Promote' : 
                       collaborator.role === 'editor' ? 'Admin' : 'Demote'}
                    </ActionButton>
                    <ActionButton
                      className="danger"
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                    >
                      Remove
                    </ActionButton>
                  </CollaboratorActions>
                </div>
              </CollaboratorItem>
            ))}
          </CollaboratorList>

          {!isAddingCollaborator ? (
            <button
              onClick={() => setIsAddingCollaborator(true)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px dashed #d1d5db',
                background: 'transparent',
                borderRadius: '0.5rem',
                color: '#6b7280',
                cursor: 'pointer',
                marginTop: '1rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.color = '#3b82f6';
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.color = '#6b7280';
              }}
            >
              ➕ Add Collaborator
            </button>
          ) : (
            <AddCollaboratorForm onSubmit={handleAddCollaborator}>
              <FormGroup>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={newCollaborator.email}
                  onChange={(e) => setNewCollaborator(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  placeholder="Enter email address"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Role</Label>
                <Select
                  value={newCollaborator.role}
                  onChange={(e) => setNewCollaborator(prev => ({
                    ...prev,
                    role: e.target.value
                  }))}
                >
                  <option value="viewer">Viewer - Can view only</option>
                  <option value="editor">Editor - Can edit</option>
                  <option value="admin">Admin - Full access</option>
                </Select>
              </FormGroup>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <SubmitButton type="submit" disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Collaborator'}
                </SubmitButton>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCollaborator(false);
                    setNewCollaborator({ email: '', role: 'viewer' });
                  }}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    borderRadius: '0.25rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </AddCollaboratorForm>
          )}
        </Section>

        <Section>
          <SectionTitle>
            <span>📝</span>
            Recent Activity
          </SectionTitle>
          
          {activity.length > 0 ? (
            <ActivityFeed>
              {activity.map((item) => (
                <ActivityItem key={item.id}>
                  <ActivityIcon>{item.icon}</ActivityIcon>
                  <ActivityContent>
                    <ActivityText>
                      <strong>{item.user}</strong> {item.action}
                    </ActivityText>
                    <ActivityTime>
                      {formatTimeAgo(item.timestamp)}
                    </ActivityTime>
                  </ActivityContent>
                </ActivityItem>
              ))}
            </ActivityFeed>
          ) : (
            <EmptyState>
              <EmptyIcon>📝</EmptyIcon>
              <EmptyText>No recent activity</EmptyText>
            </EmptyState>
          )}
        </Section>
      </CollaborationContent>
    </CollaborationContainer>
  );
};

export default CollaborationPanel;
