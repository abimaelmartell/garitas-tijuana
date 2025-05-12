document.addEventListener('DOMContentLoaded', async () => {
  const getColor = (wait) => {
    if (wait < 60) return 'bg-green-200';
    if (wait < 120) return 'bg-yellow-200';
    return 'bg-red-200';
  }

  const formatWaitTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
  }

  const renderCard = ({ name, type, wait_minutes, lanes_open, status }) => {
    const card = document.createElement('div');
    card.className = `p-6 rounded-lg shadow-lg flex items-center ${getColor(wait_minutes)}`;
    card.innerHTML = `
          <div class="flex-shrink-0 p-2">${type === 'pedestrian' ? '🚶' : '🚗'}</div>
          <div>
            <h2 class="text-xl font-semibold">${name}</h2>
            <p class="mt-1 text-gray-700">Wait: <span class="font-bold">${formatWaitTime(wait_minutes)}</span></p>
            <p class="mt-1 text-gray-700">Lanes Open: <span class="font-bold">${lanes_open}</span></p>
          </div>
        `;
    return card;
  }

  const loadTimes = async () => {
    try {
      const res = await fetch('/waittimes');
      const data = await res.json();
      const container = document.getElementById('cards');
      container.innerHTML = '';

      const crossings = [
        { key: 'otay_mesa', name: 'Otay Mesa (Car)', type: 'car', ...data.otay_mesa.lanes.car_lanes.ready_lanes },
        { key: 'otay_mesa_s', name: 'Otay Mesa (SENTRI)', type: 'car', ...data.otay_mesa.lanes.car_lanes.sentri },
        { key: 'san_ysidro', name: 'San Ysidro (Car)', type: 'car', ...data.san_ysidro.lanes.car_lanes.ready_lanes },
        { key: 'san_ysidro_s', name: 'San Ysidro (SENTRI)', type: 'car', ...data.san_ysidro.lanes.car_lanes.sentri }
      ];

      crossings.forEach(c => {
        container.appendChild(renderCard(c));
      });

      const lastUpdated = document.getElementById('last-updated');
      lastUpdated.textContent = new Date().toLocaleString();
    } catch (e) {
      console.error('Error loading times', e);
    }
  }

  loadTimes();

  /**
   * Update wait times every 30 seconds
   */
  setInterval(loadTimes, 30 * 1000);
})