import urllib.request
import json

BASE = 'http://127.0.0.1:8000'

def req(path, method='GET', data=None):
    url = BASE + path
    headers = {'Content-Type': 'application/json'}
    body = json.dumps(data).encode() if data else None
    r = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(r) as resp:
        return json.loads(resp.read().decode())

print('--- 1. Testing Login ---')
login_res = req('/api/auth/login', 'POST', {'phone': '9876543210', 'otp': '123456'})
print('Login success for:', login_res['user']['name'], '| Role:', login_res['user']['role'])

print('\n--- 2. Testing Problem Submission with AI ---')
prob_payload = {
    'title': 'Severe waterlogging at community primary school entrance',
    'description': 'Every monsoon season the main drainage overflows and floods the primary school entrance. Around 300 children cannot attend classes safely. Multiple cases of dengue reported due to stagnant water.',
    'location': 'Ward 4, Ranchi, Jharkhand',
    'severity': 'high'
}
user_id = login_res['user']['id']
new_prob = req(f'/api/problems?user_id={user_id}', 'POST', prob_payload)
pid = new_prob['id']
print('Submitted problem ID:', new_prob['problem_id'])
print('AI Category:', new_prob['ai_category'])
print('AI Summary:', new_prob['ai_summary'])
print('AI Tags:', new_prob['ai_tags'])
print('AI Domains:', new_prob['ai_domains'])
print('Initial Priority Score:', new_prob['priority_score'])
print('Initial Breakdown:', new_prob['priority_breakdown'])

print('\n--- 3. Testing Community Confirmation ---')
conf_res = req(f'/api/problems/{pid}/confirm?user_id=2', 'POST', {'note': 'Confirmed! My children attend this school.'})
print('Confirmation recorded from user:', conf_res['user_name'])

updated_prob = req(f'/api/problems/{pid}')
print('Updated Confirmation Count:', updated_prob['confirmation_count'])
print('Updated Priority Score:', updated_prob['priority_score'])
print('Updated Breakdown:', updated_prob['priority_breakdown'])

print('\n--- 4. Testing Solver Adoption ---')
adopt_res = req(f'/api/problems/{pid}/adopt?user_id=9', 'POST', {'notes': 'BIT Mesra Civil & Environmental Engineering team can construct a stormwater recharge ditch.'})
print('Adoption recorded by organization:', adopt_res['organization_name'], '| Status:', adopt_res['status'])

print('\n--- 5. Testing Milestones ---')
ms_res = req(f'/api/problems/{pid}/milestones', 'POST', {
    'title': 'Preliminary site survey and water flow mapping completed',
    'description': 'Civil engineering student team mapped drainage slopes and identified blockages.'
})
print('Milestone logged:', ms_res['title'])

print('\n--- 6. Testing Govt Dashboard Stats ---')
stats = req('/api/dashboard/stats')
print('Total Problems:', stats['total_problems'])
print('Total Users:', stats['total_users'])
print('Total Organizations:', stats['total_organizations'])
print('Total Confirmations:', stats['total_confirmations'])
print('Problems by Category (sample):', list(stats['problems_by_category'].items())[:3])
print('Problems by Status:', stats['problems_by_status'])

print('\n✓ ALL E2E VERIFICATION CHECKS PASSED!')
