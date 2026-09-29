import { themes, type AppTheme } from '../themes/themeConfig';
import { useState } from 'react';
import { Page } from '../layouts/AppLayout';
import { useTracklyStore } from '../stores/useTracklyStore';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from '../components/ui/Modal';
import { Download, LogOut } from '../components/shared/Icons';

export function Settings() {
  const {
    preferences,
    setPreferences,
    tasks,
    habits,
    schedule,
    reset,
  } = useTracklyStore();

  const { user, updateProfile, signOut } = useAuth();

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(
    user?.user_metadata?.full_name ||
      user?.email?.split('@')[0] ||
      ''
  );

  const [notice, setNotice] = useState('');

  const exportData = () => {
    const data = {
      tasks,
      habits,
      schedule,
      preferences,
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: 'application/json',
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'trackly-backup.json';
    a.click();

    URL.revokeObjectURL(url);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();

    const message = await updateProfile(name);

    if (message) {
      setNotice(message);
    } else {
      setEditing(false);
      setNotice('Profile updated.');
    }
  };

  return (
    <Page title="Settings" eyebrow="Make Trackly yours">
      <div
        style={{
          maxWidth: 680,
          display: 'grid',
          gap: 16,
        }}
      >
        {/* Profile */}
        <section className="card" style={{ padding: 21 }}>
          <h2 style={{ fontSize: 15, marginTop: 0 }}>
            Profile
          </h2>

          <p
            className="muted"
            style={{ fontSize: 13 }}
          >
            {user?.email ||
              'You are viewing the local demo workspace.'}
          </p>

          <button
            className="btn btn-soft"
            onClick={() => setEditing(true)}
          >
            Edit profile
          </button>

          {notice && (
            <p
              className="muted"
              style={{ fontSize: 12 }}
            >
              {notice}
            </p>
          )}
        </section>

        {/* Appearance */}
        <section className="card" style={{ padding: 21 }}>
          <h2 style={{ fontSize: 15, marginTop: 0 }}>
            Appearance
          </h2>

          <p
            className="muted"
            style={{ fontSize: 13 }}
          >
            Choose the feel that helps you focus.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 10,
            }}
          >
            {themes.map((theme) => (
              <button
                key={theme.id}
                title={theme.description}
                className={
                  'btn ' +
                  (preferences.theme === theme.id
                    ? 'btn-primary'
                    : 'btn-soft')
                }
                onClick={() =>
                  setPreferences({
                    theme: theme.id as AppTheme,
                  })
                }
              >
                {theme.icon} {theme.label}
              </button>
            ))}
          </div>
        </section>

        {/* Gentle Reminders */}
        <section className="card" style={{ padding: 21 }}>
          <h2 style={{ fontSize: 15, marginTop: 0 }}>
            Gentle reminders
          </h2>

          {Object.entries(preferences.reminders).map(
            ([key, value]) => (
              <label
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderTop: '1px solid #eee',
                  fontSize: 14,
                  textTransform: 'capitalize',
                }}
              >
                {key.replace(/([A-Z])/g, ' $1')}

                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setPreferences({
                      reminders: {
                        ...preferences.reminders,
                        [key]: e.target.checked,
                      },
                    })
                  }
                />
              </label>
            )
          )}
        </section>

        {/* Your Data */}
        <section className="card" style={{ padding: 21 }}>
          <h2 style={{ fontSize: 15, marginTop: 0 }}>
            Your data
          </h2>

          <p
            className="muted"
            style={{ fontSize: 13 }}
          >
            Your workspace is saved securely in this browser
            and syncs when signed in.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 9,
              flexWrap: 'wrap',
            }}
          >
            {/* Export Backup */}
            <button
              className="btn btn-soft"
              onClick={exportData}
            >
              <Download
                size={15}
                style={{ verticalAlign: 'middle' }}
              />{' '}
              Export backup
            </button>

            {/* Restore Sample Data */}
            <button
              className="btn"
              style={{
                background: '#f9eeee',
                color: '#a84c42',
              }}
              onClick={() => {
                if (
                  confirm(
                    'Restore Trackly’s sample workspace?'
                  )
                ) {
                  reset();
                }
              }}
            >
              Restore sample data
            </button>

            {/* Log Out */}
            <button
              className="btn"
              style={{
                background: '#f9eeee',
                color: '#a84c42',
              }}
              onClick={() => signOut()}
            >
              <LogOut
                size={15}
                style={{ verticalAlign: 'middle' }}
              />{' '}
              Log out
            </button>
          </div>
        </section>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <Modal
          title="Edit profile"
          onClose={() => setEditing(false)}
        >
          <form
            onSubmit={save}
            style={{
              display: 'grid',
              gap: 12,
            }}
          >
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Name

              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ marginTop: 6 }}
              />
            </label>

            <button className="btn btn-primary">
              Save changes
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}