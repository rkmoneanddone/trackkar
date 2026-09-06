import React, {useMemo, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Role = 'parent' | 'driver' | 'admin';
type Screen =
  | 'home'
  | 'discover'
  | 'alerts'
  | 'profile'
  | 'routes'
  | 'record'
  | 'active'
  | 'providers'
  | 'runs'
  | 'audit';

type NavItem = {
  key: Screen;
  label: string;
  icon: string;
};

const navByRole: Record<Role, NavItem[]> = {
  parent: [
    {key: 'home', label: 'Home', icon: '⌂'},
    {key: 'discover', label: 'Discover', icon: '⌕'},
    {key: 'alerts', label: 'Alerts', icon: '◉'},
    {key: 'profile', label: 'Profile', icon: '●'},
  ],
  driver: [
    {key: 'home', label: 'Home', icon: '⌂'},
    {key: 'routes', label: 'Routes', icon: '↗'},
    {key: 'record', label: 'Record', icon: '●'},
    {key: 'profile', label: 'Profile', icon: '●'},
  ],
  admin: [
    {key: 'home', label: 'Dashboard', icon: '⌂'},
    {key: 'providers', label: 'Providers', icon: '♙'},
    {key: 'runs', label: 'Runs', icon: '▶'},
    {key: 'audit', label: 'Audit', icon: '≡'},
  ],
};

const titles: Record<Role, Partial<Record<Screen, string>>> = {
  parent: {
    home: 'My Subscriptions',
    discover: 'Discover Services',
    alerts: 'Alerts',
    profile: 'My Profile',
  },
  driver: {
    home: 'Driver Home',
    routes: 'My Routes',
    record: 'Record Route',
    active: 'Active Route',
    profile: 'Provider Profile',
  },
  admin: {
    home: 'Admin Dashboard',
    providers: 'Providers',
    runs: 'Active Runs',
    audit: 'Audit History',
  },
};

function Badge({children}: {children: React.ReactNode}) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{children}</Text>
    </View>
  );
}

function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

function SecondaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.secondaryButton} onPress={onPress}>
      <Text style={styles.secondaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

function Card({children}: {children: React.ReactNode}) {
  return <View style={styles.card}>{children}</View>;
}

function Row({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>{left}</View>
      <View>{right}</View>
    </View>
  );
}

function Subscription({
  name,
  detail,
  price,
}: {
  name: string;
  detail: string;
  price: string;
}) {
  return (
    <View style={styles.listItem}>
      <Row
        left={
          <>
            <Text style={styles.itemTitle}>{name}</Text>
            <Text style={styles.muted}>{detail}</Text>
          </>
        }
        right={<Badge>Active</Badge>}
      />
      <View style={styles.smallGap} />
      <Row
        left={<Text style={styles.muted}>Alerts: 6 min + 3 min</Text>}
        right={<Text style={styles.price}>{price}</Text>}
      />
    </View>
  );
}

function ParentHome({go}: {go: (screen: Screen) => void}) {
  return (
    <>
      <Card>
        <Text style={styles.muted}>Active subscriptions</Text>
        <Text style={styles.metric}>3</Text>
      </Card>

      <Card>
        <Subscription
          name="Riya School Van"
          detail="Manan Vidya • Morning"
          price="₹1,800/mo"
        />
        <Subscription
          name="Rahul School Van"
          detail="DAV • Route 2"
          price="₹1,500/mo"
        />
        <Subscription
          name="Home Garbage"
          detail="Booty More Collection"
          price="₹150/mo"
        />
      </Card>

      <PrimaryButton title="Add Subscription" onPress={() => go('discover')} />
    </>
  );
}

function ParentDiscover() {
  return (
    <>
      <Card>
        <Badge>School Transport</Badge>
        <Text style={styles.cardTitle}>Manan Vidya School Van</Text>
        <Text style={styles.body}>
          Booty More → Booty Basti → Sainik Colony → Manan Vidya
        </Text>
        <Row
          left={<Text style={styles.price}>₹1,800/month</Text>}
          right={<Text style={styles.muted}>Verified ✓</Text>}
        />
        <View style={styles.buttonGap} />
        <PrimaryButton title="View Full Details" />
      </Card>

      <Card>
        <Badge>Garbage Collection</Badge>
        <Text style={styles.cardTitle}>Booty More Safai Vehicle</Text>
        <Text style={styles.body}>Recorded local collection route</Text>
        <Row
          left={<Text style={styles.price}>₹150/month</Text>}
          right={<Text style={styles.muted}>Active</Text>}
        />
      </Card>
    </>
  );
}

function ParentAlerts() {
  return (
    <>
      <Card>
        <View style={styles.alertCenter}>
          <Badge>Riya School Van</Badge>
          <Text style={styles.alertMinutes}>6 min</Text>
          <Text style={styles.alertText}>
            Your school van is approaching your saved pickup location.
          </Text>
        </View>
        <PrimaryButton title="Dismiss" />
        <View style={styles.buttonGap} />
        <SecondaryButton title="Mute This Run" />
      </Card>

      <View style={styles.note}>
        <Text style={styles.noteText}>
          A second and final alert may sound at approximately 3 minutes.
          Muting affects only this subscription and this route run.
        </Text>
      </View>
    </>
  );
}

function ParentProfile() {
  return (
    <>
      <Card>
        <Text style={styles.cardTitle}>Parent Profile</Text>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Name</Text>
          <Text style={styles.fieldValue}>Parent Name</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>parent@gmail.com</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Mobile</Text>
          <Text style={styles.fieldValue}>+91 ••••• ••321</Text>
        </View>
        <SecondaryButton title="Saved Location" />
      </Card>
      <SecondaryButton title="Logout" />
    </>
  );
}

function DriverHome({go}: {go: (screen: Screen) => void}) {
  return (
    <>
      <Card>
        <Text style={styles.muted}>Active routes</Text>
        <Text style={styles.metric}>4 / 5</Text>
      </Card>

      <Card>
        <View style={styles.listItem}>
          <Text style={styles.itemTitle}>Route 1 — Morning</Text>
          <Text style={styles.muted}>Booty More → Manan Vidya</Text>
          <View style={styles.buttonGap} />
          <PrimaryButton title="START ROUTE" onPress={() => go('active')} />
        </View>

        <View style={styles.listItem}>
          <Text style={styles.itemTitle}>Route 2 — Return</Text>
          <Text style={styles.muted}>Manan Vidya → Booty More</Text>
          <View style={styles.buttonGap} />
          <PrimaryButton title="START ROUTE" onPress={() => go('active')} />
        </View>
      </Card>
    </>
  );
}

function DriverRoutes() {
  return (
    <Card>
      <Subscription
        name="Route 1 — Morning"
        detail="Booty More → Manan Vidya"
        price="Recorded"
      />
      <Subscription
        name="Route 2 — Return"
        detail="Manan Vidya → Booty More"
        price="Recorded"
      />
      <Subscription
        name="Route 3 — DAV"
        detail="Booty More → DAV"
        price="Recorded"
      />
      <Subscription
        name="Route 4 — DAV Return"
        detail="DAV → Booty More"
        price="Map"
      />
    </Card>
  );
}

function DriverRecord() {
  return (
    <>
      <Card>
        <Badge>Recommended</Badge>
        <Text style={styles.cardTitle}>Record by Driving</Text>
        <Text style={styles.body}>
          Drive the normal route once. The app records the actual path.
        </Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Route name</Text>
          <Text style={styles.fieldValue}>Manan Vidya Morning</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Direction</Text>
          <Text style={styles.fieldValue}>Outbound</Text>
        </View>

        <PrimaryButton title="Start Recording" />
      </Card>

      <View style={styles.mapBox}>
        <Text style={styles.mapText}>
          LIVE GPS ROUTE{'\n'}Polyline appears here while driving
        </Text>
      </View>

      <Card>
        <Badge>Optional</Badge>
        <Text style={styles.cardTitle}>Create on Map</Text>
        <Text style={styles.body}>
          Set start, optional waypoints and end manually.
        </Text>
        <SecondaryButton title="Open Map Builder" />
      </Card>
    </>
  );
}

function DriverActive() {
  return (
    <>
      <Card>
        <Badge>RUNNING</Badge>
        <Text style={styles.cardTitle}>Route 1 — Morning</Text>

        <View style={styles.routeLine}>
          <View style={styles.routeRail}>
            <View style={styles.routeDot} />
            <View style={styles.routeConnector} />
            <View style={styles.routeDot} />
          </View>
          <View style={styles.routeText}>
            <Text style={styles.itemTitle}>Booty More</Text>
            <Text style={styles.muted}>Start</Text>
            <View style={styles.routeSpacer} />
            <Text style={styles.itemTitle}>Manan Vidya</Text>
            <Text style={styles.muted}>Destination</Text>
          </View>
        </View>

        <View style={styles.divider} />
        <Row
          left={<Text style={styles.body}>Started</Text>}
          right={<Text style={styles.itemTitle}>7:05 AM</Text>}
        />
        <Row
          left={<Text style={styles.body}>Subscribers</Text>}
          right={<Text style={styles.itemTitle}>18</Text>}
        />
        <Row
          left={<Text style={styles.body}>GPS</Text>}
          right={<Text style={styles.itemTitle}>Active</Text>}
        />
      </Card>

      <View style={styles.mapBox}>
        <Text style={styles.mapText}>LIVE ROUTE + VEHICLE LOCATION</Text>
      </View>

      <SecondaryButton title="END ROUTE" />
    </>
  );
}

function DriverProfile() {
  return (
    <>
      <Card>
        <Text style={styles.cardTitle}>Provider / Driver Profile</Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Name</Text>
          <Text style={styles.fieldValue}>Rajesh Kumar</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Service</Text>
          <Text style={styles.fieldValue}>School Transport</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Vehicle</Text>
          <Text style={styles.fieldValue}>JH01AB1234 • Van</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Fixed Rate</Text>
          <Text style={styles.fieldValue}>₹1,800 / month</Text>
        </View>

        <PrimaryButton title="Save Changes" />
      </Card>

      <SecondaryButton title="Logout" />
    </>
  );
}

function AdminHome() {
  return (
    <>
      <Card>
        <Text style={styles.muted}>Providers</Text>
        <Text style={styles.metric}>84</Text>
        <Text style={styles.muted}>76 active</Text>
      </Card>
      <Card>
        <Text style={styles.muted}>Subscribers</Text>
        <Text style={styles.metric}>1,428</Text>
      </Card>
      <Card>
        <Text style={styles.muted}>Active runs</Text>
        <Text style={styles.metric}>23</Text>
      </Card>
      <Card>
        <Text style={styles.muted}>Alerts today</Text>
        <Text style={styles.metric}>1,904</Text>
      </Card>
    </>
  );
}

function AdminProviders() {
  return (
    <Card>
      <View style={styles.listItem}>
        <Text style={styles.itemTitle}>Rajesh Kumar</Text>
        <Text style={styles.muted}>School Transport • JH01AB1234</Text>
        <View style={styles.buttonGap} />
        <SecondaryButton title="Review" />
      </View>
      <View style={styles.listItem}>
        <Text style={styles.itemTitle}>City Clean Service</Text>
        <Text style={styles.muted}>Garbage Collection • JH01XX9911</Text>
        <View style={styles.buttonGap} />
        <SecondaryButton title="Review" />
      </View>
    </Card>
  );
}

function AdminRuns() {
  return (
    <Card>
      <View style={styles.listItem}>
        <Text style={styles.itemTitle}>Manan Vidya Morning</Text>
        <Text style={styles.muted}>Rajesh Kumar • Started 7:05 AM</Text>
        <View style={styles.buttonGap} />
        <SecondaryButton title="Force Close" />
      </View>
      <View style={styles.listItem}>
        <Text style={styles.itemTitle}>Booty More Collection</Text>
        <Text style={styles.muted}>City Clean Service • Started 7:40 AM</Text>
        <View style={styles.buttonGap} />
        <SecondaryButton title="Force Close" />
      </View>
    </Card>
  );
}

function AdminAudit() {
  const items = [
    ['ALERT_3_MIN_SENT', '08:06 • Riya Subscription'],
    ['ALERT_6_MIN_SENT', '08:03 • Riya Subscription'],
    ['ROUTE_RUN_STARTED', '07:05 • RouteRun #1042'],
    ['VEHICLE_UPDATED', '18 Aug • JH01AB1234'],
  ];

  return (
    <Card>
      {items.map(([action, detail]) => (
        <View style={styles.listItem} key={action + detail}>
          <Text style={styles.itemTitle}>{action}</Text>
          <Text style={styles.muted}>{detail}</Text>
        </View>
      ))}
    </Card>
  );
}

function ScreenContent({
  role,
  screen,
  go,
}: {
  role: Role;
  screen: Screen;
  go: (screen: Screen) => void;
}) {
  if (role === 'parent') {
    if (screen === 'discover') return <ParentDiscover />;
    if (screen === 'alerts') return <ParentAlerts />;
    if (screen === 'profile') return <ParentProfile />;
    return <ParentHome go={go} />;
  }

  if (role === 'driver') {
    if (screen === 'routes') return <DriverRoutes />;
    if (screen === 'record') return <DriverRecord />;
    if (screen === 'active') return <DriverActive />;
    if (screen === 'profile') return <DriverProfile />;
    return <DriverHome go={go} />;
  }

  if (screen === 'providers') return <AdminProviders />;
  if (screen === 'runs') return <AdminRuns />;
  if (screen === 'audit') return <AdminAudit />;
  return <AdminHome />;
}

export default function App() {
  const [role, setRole] = useState<Role>('parent');
  const [screen, setScreen] = useState<Screen>('home');

  const navItems = useMemo(() => navByRole[role], [role]);

  const changeRole = (nextRole: Role) => {
    setRole(nextRole);
    setScreen('home');
  };

  return (
    <View style={styles.app}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F5F7" />

      <View style={styles.header}>
        <View style={styles.headerTitleArea}>
          <Text style={styles.eyebrow}>{role.toUpperCase()}</Text>
          <Text style={styles.screenTitle}>
            {titles[role][screen] ?? 'Vehicle Alert'}
          </Text>
        </View>

        <View style={styles.roleSwitch}>
          {(['parent', 'driver', 'admin'] as Role[]).map(item => (
            <TouchableOpacity
              key={item}
              style={[
                styles.rolePill,
                item === role && styles.rolePillActive,
              ]}
              onPress={() => changeRole(item)}>
              <Text
                style={[
                  styles.rolePillText,
                  item === role && styles.rolePillTextActive,
                ]}>
                {item === 'parent'
                  ? 'P'
                  : item === 'driver'
                    ? 'D'
                    : 'A'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ScreenContent role={role} screen={screen} go={setScreen} />
      </ScrollView>

      <View style={styles.bottomNav}>
        {navItems.map(item => {
          const active = screen === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.navItem}
              onPress={() => setScreen(item.key)}>
              <Text style={[styles.navIcon, active && styles.navActive]}>
                {item.icon}
              </Text>
              <Text style={[styles.navLabel, active && styles.navActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#F4F5F7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DDE1E6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleArea: {
    flex: 1,
    paddingRight: 10,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: '800',
    color: '#707782',
  },
  screenTitle: {
    marginTop: 3,
    fontSize: 23,
    fontWeight: '800',
    color: '#171A1F',
  },
  roleSwitch: {
    flexDirection: 'row',
    gap: 5,
  },
  rolePill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#D8DDE3',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rolePillActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  rolePillText: {
    color: '#68717D',
    fontSize: 11,
    fontWeight: '800',
  },
  rolePillTextActive: {
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 26,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E4E8',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 19,
    fontWeight: '800',
    color: '#171A1F',
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: '#626B76',
    marginBottom: 12,
  },
  muted: {
    fontSize: 12,
    lineHeight: 17,
    color: '#727A85',
  },
  metric: {
    marginTop: 3,
    fontSize: 30,
    fontWeight: '900',
    color: '#171A1F',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF1F4',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3F4751',
  },
  row: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowLeft: {
    flex: 1,
  },
  price: {
    fontSize: 13,
    fontWeight: '800',
    color: '#171A1F',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#171A1F',
    marginBottom: 3,
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E4E8',
  },
  smallGap: {
    height: 7,
  },
  buttonGap: {
    height: 10,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 13,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4D9DF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: '#333A43',
    fontSize: 14,
    fontWeight: '800',
  },
  alertCenter: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  alertMinutes: {
    fontSize: 60,
    lineHeight: 67,
    fontWeight: '900',
    color: '#111827',
    marginTop: 14,
  },
  alertText: {
    marginTop: 6,
    maxWidth: 280,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 21,
    color: '#555E69',
  },
  note: {
    backgroundColor: '#EDEFF2',
    borderRadius: 13,
    padding: 13,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#555D68',
  },
  field: {
    marginTop: 12,
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#727A85',
    marginBottom: 5,
  },
  fieldValue: {
    minHeight: 45,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DEE2E7',
    backgroundColor: '#FAFBFC',
    paddingHorizontal: 13,
    paddingVertical: 13,
    fontSize: 14,
    color: '#252A31',
  },
  mapBox: {
    minHeight: 230,
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#B9C0C9',
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
    marginBottom: 12,
  },
  mapText: {
    textAlign: 'center',
    color: '#777F89',
    lineHeight: 21,
    fontWeight: '700',
  },
  routeLine: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 8,
  },
  routeRail: {
    width: 24,
    alignItems: 'center',
  },
  routeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#111827',
  },
  routeConnector: {
    width: 2,
    height: 44,
    backgroundColor: '#AEB5BF',
  },
  routeText: {
    flex: 1,
    paddingLeft: 6,
  },
  routeSpacer: {
    height: 19,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E4E8',
    marginVertical: 14,
  },
  bottomNav: {
    minHeight: 70,
    paddingBottom: 5,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#DDE1E6',
    flexDirection: 'row',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 7,
  },
  navIcon: {
    fontSize: 19,
    color: '#8A929C',
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8A929C',
  },
  navActive: {
    color: '#111827',
  },
});
